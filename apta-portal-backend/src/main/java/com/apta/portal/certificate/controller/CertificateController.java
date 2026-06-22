package com.apta.portal.certificate.controller;

import com.apta.portal.certificate.entity.Certificate;
import com.apta.portal.certificate.repository.CertificateRepository;
import com.apta.portal.exception.ResourceNotFoundException;
import com.apta.portal.player.entity.Player;
import com.apta.portal.player.repository.PlayerRepository;
import com.apta.portal.registration.entity.TournamentRegistration;
import com.apta.portal.registration.repository.TournamentRegistrationRepository;
import com.apta.portal.user.entity.User;
import com.apta.portal.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TournamentRegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    private Map<String, Object> mapToResponse(Certificate cert) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", cert.getId());
        map.put("certificateNumber", cert.getCertificateNumber());
        map.put("certificateType", cert.getCertificateType());
        map.put("fileUrl", cert.getFileUrl());
        map.put("issuedAt", cert.getIssuedAt());

        if (cert.getPlayer() != null && cert.getPlayer().getUser() != null) {
            map.put("playerId", cert.getPlayer().getId());
            map.put("playerName", cert.getPlayer().getUser().getName());
            map.put("playerDistrict", cert.getPlayer().getUser().getDistrict());
        }

        if (cert.getRegistration() != null) {
            map.put("registrationId", cert.getRegistration().getId());
            if (cert.getRegistration().getTournament() != null) {
                map.put("tournamentId", cert.getRegistration().getTournament().getId());
                map.put("tournamentName", cert.getRegistration().getTournament().getTitle());
            }
            if (cert.getRegistration().getCategory() != null) {
                map.put("categoryName", cert.getRegistration().getCategory().getCategoryName());
            }
        }
        return map;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCertificates() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<Certificate> certs;
        if (user.getRole() != null && user.getRole().toUpperCase().contains("ADMIN")) {
            certs = certificateRepository.findAll();
        } else {
            Player player = playerRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Player profile not found"));
            certs = certificateRepository.findByPlayer(player);
        }

        List<Map<String, Object>> responses = certs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> issueCertificate(@RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        if (user == null || user.getRole() == null || !user.getRole().toUpperCase().contains("ADMIN")) {
            return ResponseEntity.status(403).build();
        }

        Long registrationId = Long.valueOf(body.get("registrationId").toString());
        String typeStr = (String) body.get("certificateType");

        TournamentRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Tournament registration not found"));

        String certType = typeStr.toUpperCase();
        String certNum = "APTA-CERT-" + registration.getId() + "-" + (System.currentTimeMillis() % 100000);

        Certificate certificate = Certificate.builder()
                .player(registration.getPlayer())
                .registration(registration)
                .certificateType(certType)
                .certificateNumber(certNum)
                .fileUrl("http://localhost:8082/api/certificates/pdf/" + certNum)
                .issuedBy(user)
                .issuedAt(ZonedDateTime.now())
                .build();

        certificate = certificateRepository.save(certificate);
        return ResponseEntity.ok(mapToResponse(certificate));
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyCertificate(@RequestParam String number) {
        Optional<Certificate> opt = certificateRepository.findByCertificateNumber(number);
        Map<String, Object> res = new HashMap<>();
        if (opt.isPresent()) {
            res.put("verified", true);
            res.put("certificate", mapToResponse(opt.get()));
        } else {
            res.put("verified", false);
            res.put("message", "Invalid certificate number. The certificate record could not be verified by APTA secretariat.");
        }
        return ResponseEntity.ok(res);
    }

    @GetMapping("/pdf/{number}")
    public ResponseEntity<String> getCertificateHtml(@PathVariable String number) {
        Certificate cert = certificateRepository.findByCertificateNumber(number)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));

        String title = cert.getCertificateType();
        String playerName = cert.getPlayer().getUser().getName();
        String fatherName = cert.getPlayer().getFatherName() != null ? cert.getPlayer().getFatherName() : "N/A";
        String district = cert.getPlayer().getUser().getDistrict() != null ? cert.getPlayer().getUser().getDistrict() : "N/A";
        String tournament = cert.getRegistration().getTournament().getTitle();
        String categoryName = cert.getRegistration().getCategory().getCategoryName();
        String dateString = cert.getIssuedAt().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));

        String html = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>APTA Official Certificate</title>
            <style>
                body {
                    font-family: 'Inter', 'Roboto', sans-serif;
                    background-color: #f1f5f9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                }
                .certificate-container {
                    background-color: #ffffff;
                    border: 15px solid #0f2d59;
                    outline: 5px double #d4af37;
                    outline-offset: -10px;
                    padding: 50px;
                    width: 850px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    position: relative;
                    text-align: center;
                }
                .header-seal {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .logo-ap {
                    width: 80px;
                    height: 80px;
                }
                .logo-apta {
                    width: 80px;
                    height: 80px;
                }
                .title-association {
                    font-size: 28px;
                    font-weight: 800;
                    color: #0f2d59;
                    margin: 0;
                    letter-spacing: 1px;
                }
                .subtitle-govt {
                    font-size: 14px;
                    font-weight: 600;
                    color: #475569;
                    margin: 5px 0 0 0;
                    text-transform: uppercase;
                }
                .divider {
                    height: 3px;
                    background: linear-gradient(to right, #0f2d59, #d4af37, #0f2d59);
                    margin: 25px 0;
                }
                .cert-type {
                    font-family: 'Times New Roman', Times, serif;
                    font-size: 38px;
                    font-weight: 800;
                    color: #d4af37;
                    margin: 15px 0;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }
                .award-text {
                    font-size: 18px;
                    color: #1e293b;
                    line-height: 1.8;
                    margin: 25px 0;
                    text-align: justify;
                }
                .highlight {
                    font-weight: 800;
                    color: #0f2d59;
                    border-bottom: 1px dashed #d4af37;
                    padding: 0 4px;
                }
                .signatures {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-top: 60px;
                    padding: 0 40px;
                }
                .sig-block {
                    text-align: center;
                }
                .sig-line {
                    width: 180px;
                    border-top: 1px solid #94a3b8;
                    margin-bottom: 8px;
                }
                .sig-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #475569;
                }
                .qr-container {
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }
                .cert-num {
                    font-size: 11px;
                    color: #64748b;
                    font-weight: 600;
                }
                .print-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background-color: #0f2d59;
                    color: #ffffff;
                    border: none;
                    padding: 12px 24px;
                    font-weight: 700;
                    border-radius: 6px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(15, 45, 89, 0.3);
                }
                @media print {
                    .print-btn { display: none; }
                    body { background-color: #ffffff; padding: 0; }
                    .certificate-container { box-shadow: none; border-color: #0f2d59 !important; }
                }
            </style>
        </head>
        <body>
            <button class="print-btn" onclick="window.print()">Print Certificate</button>
            
            <div class="certificate-container">
                <div class="header-seal">
                    <!-- Custom styled inline SVG representation of AP State Emblem -->
                    <svg class="logo-ap" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#006a4e" stroke-width="4"/>
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#d4af37" stroke-width="2"/>
                        <path d="M 50 15 L 50 85 M 15 50 L 85 50" stroke="#006a4e" stroke-width="2"/>
                        <text x="50" y="55" font-size="12" font-weight="900" text-anchor="middle" fill="#006a4e">GOVT AP</text>
                    </svg>
                    
                    <div style="flex-grow: 1;">
                        <h1 class="title-association">ANDHRA PRADESH TENNIKOIT ASSOCIATION</h1>
                        <h5 class="subtitle-govt">Affiliated to Tennikoit Federation of India & Govt. of Andhra Pradesh</h5>
                    </div>

                    <!-- Custom styled inline SVG representation of APTA Logo -->
                    <svg class="logo-apta" viewBox="0 0 100 100">
                        <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="#0f2d59" stroke="#d4af37" stroke-width="3"/>
                        <circle cx="50" cy="50" r="22" fill="none" stroke="#ffffff" stroke-width="2"/>
                        <text x="50" y="55" font-size="16" font-weight="900" text-anchor="middle" fill="#ffffff">APTA</text>
                    </svg>
                </div>
                
                <div class="divider"></div>
                
                <div class="cert-type">CERTIFICATE OF {TITLE}</div>
                
                <div class="award-text">
                    This is to certify that Mr. / Ms. <span class="highlight">{PLAYER_NAME}</span>, 
                    Son / Daughter of <span class="highlight">{FATHER_NAME}</span>, 
                    representing the District of <span class="highlight">{DISTRICT}</span>, 
                    has successfully participated / achieved merit standing in 
                    <span class="highlight">{TOURNAMENT}</span> 
                    for the category of <span class="highlight">{CATEGORY}</span> 
                    held on <span class="highlight">{DATE}</span>.
                </div>
                
                <div class="signatures">
                    <div class="sig-block">
                        <div class="sig-line"></div>
                        <div class="sig-title">President, APTA</div>
                    </div>
                    <div class="sig-block">
                        <!-- Tiny SVG representation of verified official seal -->
                        <svg width="60" height="60" viewBox="0 0 100 100" style="margin-bottom:-10px; opacity:0.85;">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#d4af37" stroke-width="2" stroke-dasharray="4,2"/>
                            <text x="50" y="55" font-size="10" font-weight="900" text-anchor="middle" fill="#d4af37">APTA SEAL</text>
                        </svg>
                        <div class="sig-title" style="font-size:10px; margin-top:5px; color:#d4af37;">SECURED DIGITAL VERIFICATION</div>
                    </div>
                    <div class="sig-block">
                        <div class="sig-line"></div>
                        <div class="sig-title">General Secretary, APTA</div>
                    </div>
                </div>
                
                <div class="qr-container">
                    <!-- Embedded QR code graphic showing authentication validation -->
                    <svg width="70" height="70" viewBox="0 0 100 100" style="background-color: white; padding:2px;">
                        <rect x="0" y="0" width="100" height="100" fill="white"/>
                        <!-- QR code outer corners -->
                        <rect x="10" y="10" width="20" height="20" fill="#0f2d59"/>
                        <rect x="15" y="15" width="10" height="10" fill="white"/>
                        
                        <rect x="70" y="10" width="20" height="20" fill="#0f2d59"/>
                        <rect x="75" y="15" width="10" height="10" fill="white"/>
                        
                        <rect x="10" y="70" width="20" height="20" fill="#0f2d59"/>
                        <rect x="15" y="75" width="10" height="10" fill="white"/>
                        
                        <!-- Randomized secure blocks -->
                        <rect x="40" y="20" width="10" height="20" fill="#0f2d59"/>
                        <rect x="50" y="40" width="20" height="10" fill="#0f2d59"/>
                        <rect x="30" y="60" width="15" height="15" fill="#0f2d59"/>
                        <rect x="60" y="60" width="20" height="20" fill="#0f2d59"/>
                        <rect x="75" y="45" width="10" height="10" fill="#0f2d59"/>
                    </svg>
                    <span class="cert-num">Verification ID: {NUMBER}</span>
                </div>
            </div>
        </body>
        </html>
        """;

        html = html.replace("{TITLE}", title)
                   .replace("{PLAYER_NAME}", playerName)
                   .replace("{FATHER_NAME}", fatherName)
                   .replace("{DISTRICT}", district)
                   .replace("{TOURNAMENT}", tournament)
                   .replace("{CATEGORY}", categoryName)
                   .replace("{DATE}", dateString)
                   .replace("{NUMBER}", number);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_HTML_VALUE)
                .body(html);
    }
}
