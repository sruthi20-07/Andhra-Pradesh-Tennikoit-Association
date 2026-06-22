package com.apta.portal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@SpringBootTest
class AptaPortalBackendApplicationTests {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Test
	void contextLoads() {
		String[] tables = {
			"users",
			"players",
			"player_photos",
			"tournaments", 
			"tournament_categories",
			"tournament_documents", 
			"downloads", 
			"gallery_items", 
			"notifications"
		};
		System.out.println("=================================================");
		System.out.println("DATABASE RECORD COUNT AND DETAILS VERIFICATION");
		System.out.println("=================================================");

		try (java.sql.Connection conn = java.util.Objects.requireNonNull(jdbcTemplate.getDataSource()).getConnection()) {
			java.sql.DatabaseMetaData metaData = conn.getMetaData();
			try (java.sql.ResultSet rs = metaData.getTables(null, "public", "%", new String[]{"TABLE"})) {
				System.out.println("ACTUAL TABLES IN DATABASE:");
				while (rs.next()) {
					System.out.println(" - " + rs.getString("TABLE_NAME"));
				}
			}
		} catch (Exception e) {
			System.out.println("Error reading metadata: " + e.getMessage());
		}

		for (String table : tables) {
			try {
				String countQuery = "SELECT COUNT(*) FROM " + table;
				Integer count = jdbcTemplate.queryForObject(countQuery, Integer.class);
				System.out.println("\nTABLE: " + table + " (Count: " + count + ")");
				System.out.println("-------------------------------------------------");
				
				if (count > 0) {
					String selectQuery = "SELECT * FROM " + table + " ORDER BY id DESC LIMIT 5";
					List<Map<String, Object>> rows = jdbcTemplate.queryForList(selectQuery);
					for (Map<String, Object> row : rows) {
						System.out.println("  " + row);
					}
				} else {
					System.out.println("  No records found.");
				}
			} catch (Exception e) {
				System.out.println("  Error fetching records from " + table + ": " + e.getMessage());
			}
		}
		System.out.println("=================================================");
	}

}

