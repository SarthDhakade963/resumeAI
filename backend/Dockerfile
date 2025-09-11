# Use maven and JDK base image
FROM maven:3.9.9-eclipse-temurin-24 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime image
FROM eclipse-temurin:24-jdk-alpine

WORKDIR /app

# Create uploads folder
RUN mkdir -p /root/resumai/uploads/profile-pics

# Copy default user.png
COPY user.png /root/resumai/uploads/profile-pics/

# Copy the built jar file
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose ports
EXPOSE 8080

# Run Ollama serve in background and then start backend
CMD java -jar app.jar
