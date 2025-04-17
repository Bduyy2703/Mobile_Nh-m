package com.bumble.pethotel.services.impl;

import com.bumble.pethotel.models.entity.*;
import com.bumble.pethotel.models.exception.PetApiException;
import com.bumble.pethotel.models.payload.dto.PetDto;
import com.bumble.pethotel.models.payload.dto.ReviewDto;
import com.bumble.pethotel.models.payload.responseModel.PetsResponese;
import com.bumble.pethotel.models.payload.responseModel.ReviewsResponse;
import com.bumble.pethotel.repositories.*;
import com.bumble.pethotel.services.CloudinaryService;
import com.bumble.pethotel.services.ReviewService;
import org.hibernate.NonUniqueResultException;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {
    private static final Logger logger = LoggerFactory.getLogger(ReviewServiceImpl.class);
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ShopRepository shopRepository;
    @Override
    public ReviewDto saveReview(ReviewDto reviewDto) {
        logger.info("Starting saveReview for ReviewDto: {}", reviewDto);
        try {
            logger.debug("Fetching shop with shopId: {}", reviewDto.getShopId());
            Shop shop = shopRepository.findById(reviewDto.getShopId())
                    .orElseThrow(() -> {
                        logger.error("Shop not found with shopId: {}", reviewDto.getShopId());
                        return new PetApiException(HttpStatus.NOT_FOUND, "Shop not found.");
                    });
            logger.info("Shop found: {}", shop);

            logger.debug("Fetching user with userId: {}", reviewDto.getUserId());
            User user = userRepository.findById(reviewDto.getUserId())
                    .orElseThrow(() -> {
                        logger.error("User not found with userId: {}", reviewDto.getUserId());
                        return new PetApiException(HttpStatus.NOT_FOUND, "User not found.");
                    });
            logger.info("User found: {}", user);

            logger.debug("Fetching latest booking for userId: {} and shopId: {}", reviewDto.getUserId(), reviewDto.getShopId());
            List<Booking> bookings = bookingRepository.findLatestByUserAndShop1(user, shop.getId());
            logger.info("Found {} bookings", bookings.size());
            if (bookings.isEmpty()) {
                logger.warn("No booking found for userId: {} and shopId: {}. Throwing exception.", reviewDto.getUserId(), reviewDto.getShopId());
                throw new PetApiException(HttpStatus.BAD_REQUEST, "User does not have any booking with this shop, so this action is denied.");
            }

            Booking latestBooking = bookings.get(0); // Lấy booking mới nhất (đã được ORDER BY createdAt DESC)
            logger.info("Latest booking: {}", latestBooking);

            logger.debug("Checking for existing reviews for userId: {} and shopId: {}", reviewDto.getUserId(), reviewDto.getShopId());
            List<Review> existingReviews = reviewRepository.findByUserAndShopAndIsDeleteFalse(user, shop);
            logger.info("Existing reviews: {}", existingReviews);

            if (!existingReviews.isEmpty()) {
                logger.warn("User with userId: {} has already reviewed shop with shopId: {}. Throwing exception.", reviewDto.getUserId(), reviewDto.getShopId());
                throw new PetApiException(HttpStatus.BAD_REQUEST, "This user has already reviewed this shop.");
            }

            logger.debug("Mapping ReviewDto to Review entity");
            Review review1 = modelMapper.map(reviewDto, Review.class);
            logger.info("Review entity after mapping: {}", review1);

            logger.debug("Saving review to database");
            Review savedReview = reviewRepository.save(review1);
            logger.info("Review saved successfully: {}", savedReview);

            logger.debug("Mapping saved Review to ReviewDto");
            ReviewDto result = modelMapper.map(savedReview, ReviewDto.class);
            logger.info("Returning ReviewDto: {}", result);

            return result;
        } catch (Exception e) {
            logger.error("Unexpected error occurred while saving review for userId: {} and shopId: {}. Error: {}",
                    reviewDto.getUserId(), reviewDto.getShopId(), e.getMessage(), e);
            throw new PetApiException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred while saving the review.");
        }
    }

    @Override
    public ReviewDto getReviewById(Long id) {
        Optional<Review> review = reviewRepository.findById(id);
        if(review.isEmpty()){
            throw new PetApiException(HttpStatus.NOT_FOUND, "Review not found with id: "+ id);

        }
        return modelMapper.map(review.get(),ReviewDto.class);
    }

    @Override
    public ReviewsResponse getAllReviews(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        // create Pageable instance
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<Review> reviews = reviewRepository.findAllNotDeleted(pageable);

        // get content for page object
        List<Review> listOfReviews = reviews.getContent();

        List<ReviewDto> content = listOfReviews.stream().map(bt -> modelMapper.map(bt, ReviewDto.class)).collect(Collectors.toList());

        ReviewsResponse templatesResponse = new ReviewsResponse();
        templatesResponse.setContent(content);
        templatesResponse.setPageNo(reviews.getNumber());
        templatesResponse.setPageSize(reviews.getSize());
        templatesResponse.setTotalElements(reviews.getTotalElements());
        templatesResponse.setTotalPages(reviews.getTotalPages());
        templatesResponse.setLast(reviews.isLast());

        return templatesResponse;
    }

    @Override
    public ReviewsResponse getReviewsByShop(Long shopId, int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new PetApiException(HttpStatus.NOT_FOUND,"Shop not found."));
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<Review> reviews = reviewRepository.findByShopAndIsDeleteFalse(shop,pageable);

        // get content for page object
        List<Review> listOfReviews = reviews.getContent();

        List<ReviewDto> content = listOfReviews.stream().map(bt -> modelMapper.map(bt, ReviewDto.class)).collect(Collectors.toList());

        ReviewsResponse templatesResponse = new ReviewsResponse();
        templatesResponse.setContent(content);
        templatesResponse.setPageNo(reviews.getNumber());
        templatesResponse.setPageSize(reviews.getSize());
        templatesResponse.setTotalElements(reviews.getTotalElements());
        templatesResponse.setTotalPages(reviews.getTotalPages());
        templatesResponse.setLast(reviews.isLast());

        return templatesResponse;
    }
}
