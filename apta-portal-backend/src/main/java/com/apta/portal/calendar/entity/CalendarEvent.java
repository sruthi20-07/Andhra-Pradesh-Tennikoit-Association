package com.apta.portal.calendar.entity;

import com.apta.portal.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "calendar_events")
public class CalendarEvent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "date_text", length = 150)
    private String dateText;

    @Size(max = 255)
    @Column(length = 255)
    private String location;

    @Column(name = "event_type", length = 30)
    private String type = "TOURNAMENT";

    @Size(max = 512)
    @Column(name = "link_url", length = 512)
    private String linkUrl;

    public CalendarEvent() {
    }

    public CalendarEvent(Long id, String title, String description, LocalDate eventDate, String dateText, String location, String type, String linkUrl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.eventDate = eventDate;
        this.dateText = dateText;
        this.location = location;
        this.type = type;
        this.linkUrl = linkUrl;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getEventDate() {
        return this.eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getDateText() {
        return this.dateText;
    }

    public void setDateText(String dateText) {
        this.dateText = dateText;
    }

    public String getLocation() {
        return this.location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLinkUrl() {
        return this.linkUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }

    public static CalendarEventBuilder builder() {
        return new CalendarEventBuilder();
    }

    public static class CalendarEventBuilder {
        private Long id;
        private String title;
        private String description;
        private LocalDate eventDate;
        private String dateText;
        private String location;
        private String type = "TOURNAMENT";
        private String linkUrl;

        public CalendarEventBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CalendarEventBuilder title(String title) {
            this.title = title;
            return this;
        }

        public CalendarEventBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CalendarEventBuilder eventDate(LocalDate eventDate) {
            this.eventDate = eventDate;
            return this;
        }

        public CalendarEventBuilder dateText(String dateText) {
            this.dateText = dateText;
            return this;
        }

        public CalendarEventBuilder location(String location) {
            this.location = location;
            return this;
        }

        public CalendarEventBuilder type(String type) {
            this.type = type;
            return this;
        }

        public CalendarEventBuilder linkUrl(String linkUrl) {
            this.linkUrl = linkUrl;
            return this;
        }

        public CalendarEvent build() {
            return new CalendarEvent(
                this.id,
                this.title,
                this.description,
                this.eventDate,
                this.dateText,
                this.location,
                this.type,
                this.linkUrl
            );
        }
    }
}
