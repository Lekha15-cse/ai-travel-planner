package com.lekha.travel_planner.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    private RestTemplate restTemplate = new RestTemplate();

    public String getWeather(String destination) {
        try {
            String formattedDestination = destination.replace(" ", "+");
            String url = "https://wttr.in/" + formattedDestination + "?format=3";
            String weather = restTemplate.getForObject(url, String.class);
            return weather;
        } catch (Exception e) {
            return "Weather data currently unavailable";
        }
    }
}
