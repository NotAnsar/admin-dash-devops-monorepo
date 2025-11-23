package org.example.api.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {
    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class S3UploadResult {
        private String url;
        private String key;
    }

    public S3UploadResult uploadFile(MultipartFile file) throws IOException {
        // Generate a unique key with a folder structure
        String originalFilename = file.getOriginalFilename();
        String sanitizedFilename = originalFilename != null ?
                originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_") :
                "unnamed_file";

        String key = "products/" + UUID.randomUUID() + "-" + sanitizedFilename;

        // Set up metadata
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        // Upload to S3
        PutObjectRequest request = new PutObjectRequest(
                bucketName,
                key,
                file.getInputStream(),
                metadata
        );

        amazonS3.putObject(request);

        // Generate URL
        String url = amazonS3.getUrl(bucketName, key).toString();

        // Return both URL and key
        return new S3UploadResult(url, key);
    }

    public void deleteFile(String key) {
        if (key == null || key.isEmpty()) {
            throw new IllegalArgumentException("S3 key cannot be null or empty");
        }

        System.out.println("Deleting S3 object with key: " + key);

        // Check if object exists before attempting deletion
        if (amazonS3.doesObjectExist(bucketName, key)) {
            amazonS3.deleteObject(bucketName, key);
            System.out.println("S3 object deleted successfully");
        } else {
            System.out.println("S3 object not found, nothing to delete");
        }
    }
}