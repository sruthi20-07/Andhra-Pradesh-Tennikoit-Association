package com.apta.portal.contact.service;

import com.apta.portal.contact.entity.Contact;
import java.util.List;

public interface ContactService {
    Contact saveContact(Contact contact);
    List<Contact> getAllContacts();
    Contact updateStatusAndReply(Long id, String status, String reply);
}
