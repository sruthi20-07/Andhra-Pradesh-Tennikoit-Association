package com.apta.portal.player.entity;

import com.apta.portal.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "player_photos")
public class PlayerPhoto extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @NotBlank
    @Size(max = 512)
    @Column(name = "photo_url", nullable = false, length = 512)
    private String photoUrl;

    public PlayerPhoto() {
    }

    public PlayerPhoto(Long id, Player player, String photoUrl) {
        this.id = id;
        this.player = player;
        this.photoUrl = photoUrl;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Player getPlayer() {
        return this.player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public String getPhotoUrl() {
        return this.photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public static PlayerPhotoBuilder builder() {
        return new PlayerPhotoBuilder();
    }

    public static class PlayerPhotoBuilder {
        private Long id;
        private Player player;
        private String photoUrl;

        public PlayerPhotoBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PlayerPhotoBuilder player(Player player) {
            this.player = player;
            return this;
        }

        public PlayerPhotoBuilder photoUrl(String photoUrl) {
            this.photoUrl = photoUrl;
            return this;
        }

        public PlayerPhoto build() {
            return new PlayerPhoto(this.id, this.player, this.photoUrl);
        }
    }
}
