FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Copy source
COPY src src

# Make mvnw executable and fix line endings
RUN chmod +x mvnw && sed -i 's/\r$//' mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/API-0.0.1-SNAPSHOT.jar"]