package org.example.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.ToString;
import java.util.List;
import org.hibernate.annotations.GenericGenerator;

import java.time.ZonedDateTime;
import java.util.UUID;

@Table(name = "\"user\"") // Quoted because user is a reserved keyword in many databases
@Entity
@Data
@ToString(exclude = "password")
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;

    @Size(max = 50)
    @Column(name = "f_name")
    private String firstName;

    @Size(max = 50)
    @Column(name = "l_name")
    private String lastName;

    @Email
    @NotBlank
    @Column(unique = true)
    private String email;

    @NotBlank
    @Size(max = 100)
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private UserRole role;

    @OneToMany(mappedBy = "user")
    private List<Order> orders;

}


