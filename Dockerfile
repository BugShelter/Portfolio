FROM amazoncorretto:25-alpine

RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /app
RUN chown spring:spring /app
ARG JAR_FILE=build/libs/*.jar
COPY --chown=spring:spring ${JAR_FILE} app.jar

USER spring:spring

ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseSerialGC -Xss512k -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]