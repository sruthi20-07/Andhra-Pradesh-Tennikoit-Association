package com.apta.portal.contact.service;

import com.apta.portal.contact.entity.Contact;
import com.apta.portal.contact.repository.ContactRepository;
import com.apta.portal.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public Contact saveContact(Contact contact) {
        if (contact.getStatus() == null || contact.getStatus().trim().isEmpty()) {
            contact.setStatus("OPEN");
        }
        return contactRepository.save(contact);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Contact> getAllContacts() {
        return contactRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Contact updateStatusAndReply(Long id, String status, String reply) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with id: " + id));
        if (status != null && !status.trim().isEmpty()) {
            contact.setStatus(status.trim().toUpperCase());
        }
        contact.setAdminReply(reply);
        return contactRepository.save(contact);
    }
}
