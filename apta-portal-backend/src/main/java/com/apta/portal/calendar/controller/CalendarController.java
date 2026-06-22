package com.apta.portal.calendar.controller;

import com.apta.portal.calendar.entity.CalendarEvent;
import com.apta.portal.calendar.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    private CalendarEventRepository calendarRepository;

    private Map<String, Object> mapToResponse(CalendarEvent ev) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", ev.getId());
        map.put("name", ev.getTitle());
        String displayDate = ev.getDateText();
        if (displayDate == null || displayDate.isBlank()) {
            displayDate = ev.getEventDate() != null ? ev.getEventDate().toString() : "";
        }
        map.put("date", displayDate);
        map.put("location", ev.getLocation());
        map.put("description", ev.getDescription());
        return map;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getEvents() {
        List<Map<String, Object>> responses = calendarRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createEvent(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String dateStr = (String) body.get("date");
        String location = (String) body.get("location");
        String description = (String) body.get("description");

        LocalDate parsedDate = null;
        try {
            if (dateStr != null && !dateStr.isBlank()) {
                parsedDate = LocalDate.parse(dateStr);
            }
        } catch (Exception ignored) {
            // keep human-readable date in date_text when not ISO format
        }

        CalendarEvent event = CalendarEvent.builder()
                .title(name)
                .eventDate(parsedDate != null ? parsedDate : LocalDate.now())
                .dateText(dateStr)
                .location(location)
                .description(description)
                .type("TOURNAMENT")
                .build();

        event = calendarRepository.save(event);
        return ResponseEntity.ok(mapToResponse(event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (calendarRepository.existsById(id)) {
            calendarRepository.deleteById(id);
        }
        return ResponseEntity.ok().build();
    }
}
