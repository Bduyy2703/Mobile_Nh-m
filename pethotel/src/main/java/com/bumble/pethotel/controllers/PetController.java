package com.bumble.pethotel.controllers;

import com.bumble.pethotel.models.entity.ImageFile;
import com.bumble.pethotel.models.entity.User;
import com.bumble.pethotel.models.payload.dto.PetDto;
import com.bumble.pethotel.models.payload.requestModel.PetUpdated;
import com.bumble.pethotel.models.payload.responseModel.PetsResponese;
import com.bumble.pethotel.repositories.UserRepository;
import com.bumble.pethotel.services.PetService;
import com.bumble.pethotel.utils.AppConstants;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/pets")
public class PetController {
    @Autowired
    private PetService petService;

    @Autowired
    private UserRepository userRepository; // Thêm UserRepository để truy vấn user

    @SecurityRequirement(name = "Bear Authentication")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<?> createPet(@Valid @ModelAttribute PetDto petDto,
                                       @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName(); // Lấy username từ authentication
            System.out.println("Username from authentication: " + username);

            // Truy vấn user từ username để lấy userId
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isEmpty()) {
                throw new RuntimeException("User not found with username: " + username);
            }
            Long userId = userOptional.get().getId();
            System.out.println("Found userId: " + userId);

            System.out.println("Received PetDto: " + petDto);
            if (files != null && !files.isEmpty()) {
                System.out.println("Files received: " + files.size());
                for (MultipartFile file : files) {
                    System.out.println("File name: " + file.getOriginalFilename() + ", Size: " + file.getSize());
                }
            } else {
                System.out.println("No files received");
            }
            PetDto pt = petService.savePet(petDto, userId, files);
            return new ResponseEntity<>(pt, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println("Error processing request: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping
    public PetsResponese getAllPets(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                    @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                    @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                    @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir) {
        return petService.getAllPet(pageNo, pageSize, sortBy, sortDir);
    }

    @GetMapping("/users/{userId}")
    public PetsResponese getPetsByUser(@RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
                                       @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize,
                                       @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
                                       @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
                                       @PathVariable("userId") Long userId) {
        return petService.getPetByUserId(userId, pageNo, pageSize, sortBy, sortDir);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPetById(@PathVariable("id") Long id) {
        PetDto petDto = petService.getPetById(id);
        return new ResponseEntity<>(petDto, HttpStatus.OK);
    }

    @SecurityRequirement(name = "Bear Authentication")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePet(@PathVariable("id") Long id, @Valid @ModelAttribute PetUpdated petUpdated) {
        PetDto bt1 = petService.updatePet(id, petUpdated);
        return new ResponseEntity<>(bt1, HttpStatus.OK);
    }

    @SecurityRequirement(name = "Bear Authentication")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_ADMIN')")
    @PutMapping("/images/{id}")
    public ResponseEntity<?> uploadImage(@PathVariable("id") Long id, @RequestParam("files") List<MultipartFile> files) {
        String msg = petService.uploadImagePet(id, files);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }

    @GetMapping("/images/{id}")
    public ResponseEntity<?> getImageShop(@PathVariable("id") Long id) {
        Set<ImageFile> images = petService.getImagePet(id);
        return new ResponseEntity<>(images, HttpStatus.OK);
    }

    @SecurityRequirement(name = "Bear Authentication")
    @PreAuthorize("hasRole('ROLE_CUSTOMER') or hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable("id") Long id) {
        String msg = petService.deletePet(id);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }
}