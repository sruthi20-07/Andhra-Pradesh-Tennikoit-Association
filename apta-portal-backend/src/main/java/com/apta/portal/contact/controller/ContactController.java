package com.apta.portal.contact.controller;

import com.apta.portal.contact.entity.Contact;
import com.apta.portal.contact.service.ContactService;
import com.apta.portal.contact.repository.ContactRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ContactController {

    @Autowired
    private ContactService contactService;

    @Autowired
    private ContactRepository contactRepository;

    @PostMapping("/api/contact")
    public ResponseEntity<Map<String, Object>> submitContact(@Valid @RequestBody Contact contact) {
        contactService.saveContact(contact);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Query submitted successfully.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/admin/contacts")
    public ResponseEntity<List<Contact>> getContactMessages(@RequestParam(required = false) String search) {
        // Return sorted list
        if (search != null && !search.trim().isEmpty()) {
            // Simple in-memory filter if a search parameter is present, or return all
            String clean = search.trim().toLowerCase();
            List<Contact> filtered = contactService.getAllContacts().stream()
                    .filter(c -> (c.getName() != null && c.getName().toLowerCase().contains(clean)) ||
                                 (c.getEmail() != null && c.getEmail().toLowerCase().contains(clean)) ||
                                 (c.getSubject() != null && c.getSubject().toLowerCase().contains(clean)) ||
                                 (c.getMessage() != null && c.getMessage().toLowerCase().contains(clean)))
                    .toList();
            return ResponseEntity.ok(filtered);
        }
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @PutMapping("/api/admin/contacts/{id}/reply")
    public ResponseEntity<Contact> updateStatusAndReply(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        String reply = request.get("reply");
        Contact updated = contactService.updateStatusAndReply(id, status, reply);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/api/admin/contacts/{id}")
    public ResponseEntity<Map<String, Object>> deleteContactMessage(@PathVariable Long id) {
        contactRepository.deleteById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Contact query deleted successfully");
        return ResponseEntity.ok(response);
    }
}
