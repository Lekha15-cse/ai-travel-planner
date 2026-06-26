package com.lekha.travel_planner.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lekha.travel_planner.service.GroqService;
import com.lekha.travel_planner.service.WeatherService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TravelController {

    @Autowired
    private GroqService groqService;

    @Autowired
    private WeatherService weatherService;

    @PostMapping("/plan")
    public ResponseEntity<Map<String, Object>> generateTravelPlan(@RequestBody Map<String, String> request) {
        String destination = request.get("destination");
        String duration = request.get("duration");
        String budget = request.get("budget");
        String interests = request.get("interests");

        String itinerary = groqService.generateItinerary(destination, duration, budget, interests);
        String weather = weatherService.getWeather(destination);

        Map<String, Object> response = new HashMap<>();
        response.put("itinerary", itinerary);
        response.put("weather", weather);
        response.put("destination", destination);

        return ResponseEntity.ok(response);
    }
}
