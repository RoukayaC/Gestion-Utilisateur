# Use OpenJDK with Maven included
FROM openjdk:17-jdk-slim

# Install Maven and curl
RUN apt-get update && \
    apt-get install -y maven curl && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the application
RUN mvn clean package -DskipTests

# Create volume for H2 database
VOLUME ["/app/data"]

# Expose port
EXPOSE 8080

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=docker

# Run the application
CMD ["java", "-jar", "target/user-management-0.0.1-SNAPSHOT.jar"]