package com.apta.portal.tournament.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class TournamentCreateRequest {
    private String title;
    private String description;
    private String venue;
    private String organizer;
    private LocalDate startDate;
    private LocalDate endDate;
    private String registrationDeadline;
    private BigDecimal entryFee;
    private String status;
    private List<CategoryRequest> categories;
    private List<DocumentRequest> documents;

    public TournamentCreateRequest() {}

    public TournamentCreateRequest(String title, String description, String venue, String organizer, LocalDate startDate, LocalDate endDate, String registrationDeadline, BigDecimal entryFee, String status, List<CategoryRequest> categories, List<DocumentRequest> documents) {
        this.title = title;
        this.description = description;
        this.venue = venue;
        this.organizer = organizer;
        this.startDate = startDate;
        this.endDate = endDate;
        this.registrationDeadline = registrationDeadline;
        this.entryFee = entryFee;
        this.status = status;
        this.categories = categories;
        this.documents = documents;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getRegistrationDeadline() { return registrationDeadline; }
    public void setRegistrationDeadline(String registrationDeadline) { this.registrationDeadline = registrationDeadline; }

    public BigDecimal getEntryFee() { return entryFee; }
    public void setEntryFee(BigDecimal entryFee) { this.entryFee = entryFee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<CategoryRequest> getCategories() { return categories; }
    public void setCategories(List<CategoryRequest> categories) { this.categories = categories; }

    public List<DocumentRequest> getDocuments() { return documents; }
    public void setDocuments(List<DocumentRequest> documents) { this.documents = documents; }

    public static TournamentCreateRequestBuilder builder() {
        return new TournamentCreateRequestBuilder();
    }

    public static class TournamentCreateRequestBuilder {
        private String title;
        private String description;
        private String venue;
        private String organizer;
        private LocalDate startDate;
        private LocalDate endDate;
        private String registrationDeadline;
        private BigDecimal entryFee;
        private String status;
        private List<CategoryRequest> categories;
        private List<DocumentRequest> documents;

        public TournamentCreateRequestBuilder title(String title) { this.title = title; return this; }
        public TournamentCreateRequestBuilder description(String description) { this.description = description; return this; }
        public TournamentCreateRequestBuilder venue(String venue) { this.venue = venue; return this; }
        public TournamentCreateRequestBuilder organizer(String organizer) { this.organizer = organizer; return this; }
        public TournamentCreateRequestBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public TournamentCreateRequestBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public TournamentCreateRequestBuilder registrationDeadline(String registrationDeadline) { this.registrationDeadline = registrationDeadline; return this; }
        public TournamentCreateRequestBuilder entryFee(BigDecimal entryFee) { this.entryFee = entryFee; return this; }
        public TournamentCreateRequestBuilder status(String status) { this.status = status; return this; }
        public TournamentCreateRequestBuilder categories(List<CategoryRequest> categories) { this.categories = categories; return this; }
        public TournamentCreateRequestBuilder documents(List<DocumentRequest> documents) { this.documents = documents; return this; }

        public TournamentCreateRequest build() {
            return new TournamentCreateRequest(title, description, venue, organizer, startDate, endDate, registrationDeadline, entryFee, status, categories, documents);
        }
    }

    public static class CategoryRequest {
        private String categoryName;
        private String gender;
        private Integer minAge;
        private Integer maxAge;

        public CategoryRequest() {}

        public CategoryRequest(String categoryName, String gender, Integer minAge, Integer maxAge) {
            this.categoryName = categoryName;
            this.gender = gender;
            this.minAge = minAge;
            this.maxAge = maxAge;
        }

        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public Integer getMinAge() { return minAge; }
        public void setMinAge(Integer minAge) { this.minAge = minAge; }

        public Integer getMaxAge() { return maxAge; }
        public void setMaxAge(Integer maxAge) { this.maxAge = maxAge; }

        public static CategoryRequestBuilder builder() {
            return new CategoryRequestBuilder();
        }

        public static class CategoryRequestBuilder {
            private String categoryName;
            private String gender;
            private Integer minAge;
            private Integer maxAge;

            public CategoryRequestBuilder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
            public CategoryRequestBuilder gender(String gender) { this.gender = gender; return this; }
            public CategoryRequestBuilder minAge(Integer minAge) { this.minAge = minAge; return this; }
            public CategoryRequestBuilder maxAge(Integer maxAge) { this.maxAge = maxAge; return this; }

            public CategoryRequest build() {
                return new CategoryRequest(categoryName, gender, minAge, maxAge);
            }
        }
    }

    public static class DocumentRequest {
        private String fileName;
        private String filePath;
        private String fileType;

        public DocumentRequest() {}

        public DocumentRequest(String fileName, String filePath, String fileType) {
            this.fileName = fileName;
            this.filePath = filePath;
            this.fileType = fileType;
        }

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }

        public String getFilePath() { return filePath; }
        public void setFilePath(String filePath) { this.filePath = filePath; }

        public String getFileType() { return fileType; }
        public void setFileType(String fileType) { this.fileType = fileType; }

        public static DocumentRequestBuilder builder() {
            return new DocumentRequestBuilder();
        }

        public static class DocumentRequestBuilder {
            private String fileName;
            private String filePath;
            private String fileType;

            public DocumentRequestBuilder fileName(String fileName) { this.fileName = fileName; return this; }
            public DocumentRequestBuilder filePath(String filePath) { this.filePath = filePath; return this; }
            public DocumentRequestBuilder fileType(String fileType) { this.fileType = fileType; return this; }

            public DocumentRequest build() {
                return new DocumentRequest(fileName, filePath, fileType);
            }
        }
    }
}
