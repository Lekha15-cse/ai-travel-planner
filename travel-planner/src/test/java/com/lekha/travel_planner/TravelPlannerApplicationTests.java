package com.lekha.travel_planner;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
	"groq.api.key=test-key-for-context-load",
	"groq.api.url=https://api.groq.com/openai/v1/chat/completions",
	"groq.api.model=llama-3.3-70b-versatile"
})
class TravelPlannerApplicationTests {

	@Test
	void contextLoads() {
	}

}
