-- Insert sample categories
INSERT INTO categories (name, slug, description, is_active, created_at, updated_at) VALUES
('Playa', 'beach', 'Alojamiento frente al mar y playa', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ciudad', 'city', 'Hoteles en zonas urbanas y céntricas', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Montaña', 'mountain', 'Lodges y refugios en zonas montañosas', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Negocios', 'business', 'Alojamiento enfocado en viajes corporativos', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample rooms data with comprehensive hotel information
INSERT INTO rooms (room_number, room_type, capacity, price_per_night, description, hotel_name, hotel_chain, hotel_rating, city, country, address, latitude, longitude, view_type, floor, size_sqm, has_balcony, has_wifi, has_air_conditioning, is_available, created_at, updated_at) VALUES

-- Grand Hotel Barcelona
('101', 'SINGLE', 1, 89.99, 'Elegant single room with modern amenities and city view', 'Grand Hotel Barcelona', 'Luxury Collection', 4.5, 'Barcelona', 'Spain', 'Passeig de Gràcia 68', 41.3851, 2.1734, 'City View', 1, 25.5, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('102', 'DOUBLE', 2, 129.99, 'Spacious double room with king bed and private balcony', 'Grand Hotel Barcelona', 'Luxury Collection', 4.5, 'Barcelona', 'Spain', 'Passeig de Gràcia 68', 41.3851, 2.1734, 'Garden View', 1, 35.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('201', 'SUITE', 4, 299.99, 'Luxury suite with separate living area and panoramic city view', 'Grand Hotel Barcelona', 'Luxury Collection', 4.5, 'Barcelona', 'Spain', 'Passeig de Gràcia 68', 41.3851, 2.1734, 'City View', 2, 65.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('301', 'DELUXE', 2, 249.99, 'Deluxe room with premium amenities and mountain view', 'Grand Hotel Barcelona', 'Luxury Collection', 4.5, 'Barcelona', 'Spain', 'Passeig de Gràcia 68', 41.3851, 2.1734, 'Mountain View', 3, 42.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Hotel Ritz Madrid
('M101', 'SINGLE', 1, 95.99, 'Classic single room in historic luxury hotel', 'Hotel Ritz Madrid', 'Mandarin Oriental', 5.0, 'Madrid', 'Spain', 'Plaza de la Lealtad 5', 40.4168, -3.7038, 'Plaza View', 1, 28.0, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('M102', 'DOUBLE', 2, 149.99, 'Elegant double room with royal palace view', 'Hotel Ritz Madrid', 'Mandarin Oriental', 5.0, 'Madrid', 'Spain', 'Plaza de la Lealtad 5', 40.4168, -3.7038, 'Palace View', 1, 38.5, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('M201', 'SUITE', 4, 399.99, 'Presidential suite with marble bathroom and terrace', 'Hotel Ritz Madrid', 'Mandarin Oriental', 5.0, 'Madrid', 'Spain', 'Plaza de la Lealtad 5', 40.4168, -3.7038, 'City View', 2, 85.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('M301', 'FAMILY', 6, 279.99, 'Family suite with connecting rooms and park view', 'Hotel Ritz Madrid', 'Mandarin Oriental', 5.0, 'Madrid', 'Spain', 'Plaza de la Lealtad 5', 40.4168, -3.7038, 'Park View', 3, 75.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Seaside Resort Miami
('MI101', 'DOUBLE', 2, 189.99, 'Oceanfront room with direct beach access', 'Seaside Resort Miami', 'Independent', 4.2, 'Miami', 'United States', '1701 Collins Avenue', 25.7617, -80.1918, 'Ocean View', 1, 40.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MI102', 'SUITE', 4, 349.99, 'Luxury oceanfront suite with private pool', 'Seaside Resort Miami', 'Independent', 4.2, 'Miami', 'United States', '1701 Collins Avenue', 25.7617, -80.1918, 'Ocean View', 1, 70.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MI201', 'DELUXE', 2, 229.99, 'Deluxe room with panoramic ocean view', 'Seaside Resort Miami', 'Independent', 4.2, 'Miami', 'United States', '1701 Collins Avenue', 25.7617, -80.1918, 'Ocean View', 2, 45.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('MI301', 'FAMILY', 8, 399.99, 'Large family suite with kitchenette and ocean view', 'Seaside Resort Miami', 'Independent', 4.2, 'Miami', 'United States', '1701 Collins Avenue', 25.7617, -80.1918, 'Ocean View', 3, 90.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Alpine Lodge Zurich
('Z101', 'SINGLE', 1, 159.99, 'Cozy alpine room with mountain view', 'Alpine Lodge Zurich', 'Swiss Hotels', 4.3, 'Zurich', 'Switzerland', 'Bahnhofstrasse 87', 47.3769, 8.5417, 'Mountain View', 1, 22.0, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Z102', 'DOUBLE', 2, 219.99, 'Traditional Swiss room with lake view', 'Alpine Lodge Zurich', 'Swiss Hotels', 4.3, 'Zurich', 'Switzerland', 'Bahnhofstrasse 87', 47.3769, 8.5417, 'Lake View', 1, 35.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Z201', 'SUITE', 4, 459.99, 'Luxury alpine suite with fireplace and panoramic view', 'Alpine Lodge Zurich', 'Swiss Hotels', 4.3, 'Zurich', 'Switzerland', 'Bahnhofstrasse 87', 47.3769, 8.5417, 'Mountain View', 2, 80.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Z301', 'DELUXE', 2, 329.99, 'Premium room with Swiss design and city view', 'Alpine Lodge Zurich', 'Swiss Hotels', 4.3, 'Zurich', 'Switzerland', 'Bahnhofstrasse 87', 47.3769, 8.5417, 'City View', 3, 50.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Tokyo Imperial Hotel
('T101', 'SINGLE', 1, 179.99, 'Modern Japanese-style single room', 'Tokyo Imperial Hotel', 'Imperial Collection', 4.8, 'Tokyo', 'Japan', '1-1-1 Uchisaiwaicho', 35.6762, 139.6503, 'Garden View', 1, 30.0, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('T102', 'DOUBLE', 2, 259.99, 'Traditional tatami room with city skyline view', 'Tokyo Imperial Hotel', 'Imperial Collection', 4.8, 'Tokyo', 'Japan', '1-1-1 Uchisaiwaicho', 35.6762, 139.6503, 'City View', 1, 42.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('T201', 'SUITE', 4, 599.99, 'Imperial suite with traditional tea ceremony area', 'Tokyo Imperial Hotel', 'Imperial Collection', 4.8, 'Tokyo', 'Japan', '1-1-1 Uchisaiwaicho', 35.6762, 139.6503, 'City View', 2, 95.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('T301', 'FAMILY', 6, 389.99, 'Family room with connecting traditional and modern areas', 'Tokyo Imperial Hotel', 'Imperial Collection', 4.8, 'Tokyo', 'Japan', '1-1-1 Uchisaiwaicho', 35.6762, 139.6503, 'Garden View', 3, 78.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Parisian Boutique Hotel
('P101', 'SINGLE', 1, 139.99, 'Charming Parisian room with vintage decor', 'Le Petit Palais', 'Boutique Collection', 4.1, 'Paris', 'France', '15 Rue de Rivoli', 48.8566, 2.3522, 'Courtyard View', 1, 26.0, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('P102', 'DOUBLE', 2, 199.99, 'Romantic room with Eiffel Tower view', 'Le Petit Palais', 'Boutique Collection', 4.1, 'Paris', 'France', '15 Rue de Rivoli', 48.8566, 2.3522, 'Tower View', 1, 38.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('P201', 'SUITE', 4, 449.99, 'Luxury Parisian suite with Seine river view', 'Le Petit Palais', 'Boutique Collection', 4.1, 'Paris', 'France', '15 Rue de Rivoli', 48.8566, 2.3522, 'River View', 2, 72.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('P301', 'DELUXE', 2, 289.99, 'Deluxe room with French balcony and city view', 'Le Petit Palais', 'Boutique Collection', 4.1, 'Paris', 'France', '15 Rue de Rivoli', 48.8566, 2.3522, 'City View', 3, 45.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- London Heritage Hotel
('L101', 'SINGLE', 1, 119.99, 'Classic British single room with period features', 'The Crown London', 'Heritage Hotels', 4.4, 'London', 'United Kingdom', '25 Piccadilly', 51.5074, -0.1278, 'Street View', 1, 24.0, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('L102', 'DOUBLE', 2, 179.99, 'Traditional English room with Hyde Park view', 'The Crown London', 'Heritage Hotels', 4.4, 'London', 'United Kingdom', '25 Piccadilly', 51.5074, -0.1278, 'Park View', 1, 36.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('L201', 'SUITE', 4, 399.99, 'Royal suite with antique furnishings and Thames view', 'The Crown London', 'Heritage Hotels', 4.4, 'London', 'United Kingdom', '25 Piccadilly', 51.5074, -0.1278, 'River View', 2, 68.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('L301', 'FAMILY', 6, 299.99, 'Family room with bunk beds and garden view', 'The Crown London', 'Heritage Hotels', 4.4, 'London', 'United Kingdom', '25 Piccadilly', 51.5074, -0.1278, 'Garden View', 3, 55.0, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- New York City Skyscraper Hotel
('NY101', 'SINGLE', 1, 199.99, 'Modern single room with Central Park view', 'Manhattan Heights', 'Urban Collection', 4.6, 'New York', 'United States', '768 5th Avenue', 40.7589, -73.9851, 'Park View', 1, 28.0, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('NY102', 'DOUBLE', 2, 289.99, 'Luxury room with Empire State Building view', 'Manhattan Heights', 'Urban Collection', 4.6, 'New York', 'United States', '768 5th Avenue', 40.7589, -73.9851, 'City View', 1, 40.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('NY201', 'SUITE', 4, 599.99, 'Penthouse suite with 360-degree city views', 'Manhattan Heights', 'Urban Collection', 4.6, 'New York', 'United States', '768 5th Avenue', 40.7589, -73.9851, 'City View', 2, 85.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('NY301', 'DELUXE', 2, 389.99, 'Deluxe corner room with Broadway view', 'Manhattan Heights', 'Urban Collection', 4.6, 'New York', 'United States', '768 5th Avenue', 40.7589, -73.9851, 'City View', 3, 52.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Rome Historic Hotel
('R101', 'SINGLE', 1, 109.99, 'Charming room near the Colosseum', 'Hotel Romano', 'Historic Collection', 4.0, 'Rome', 'Italy', 'Via del Corso 126', 41.9028, 12.4964, 'Historic View', 1, 25.0, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('R102', 'DOUBLE', 2, 169.99, 'Elegant room with Vatican view', 'Hotel Romano', 'Historic Collection', 4.0, 'Rome', 'Italy', 'Via del Corso 126', 41.9028, 12.4964, 'Vatican View', 1, 35.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('R201', 'SUITE', 4, 389.99, 'Luxury suite with Pantheon view and marble bathroom', 'Hotel Romano', 'Historic Collection', 4.0, 'Rome', 'Italy', 'Via del Corso 126', 41.9028, 12.4964, 'Historic View', 2, 70.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('R301', 'FAMILY', 8, 279.99, 'Large family room with Roman architecture features', 'Hotel Romano', 'Historic Collection', 4.0, 'Rome', 'Italy', 'Via del Corso 126', 41.9028, 12.4964, 'City View', 3, 65.0, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sydney Harbor Hotel
('S101', 'SINGLE', 1, 149.99, 'Modern room with harbor glimpse', 'Harbor View Sydney', 'Pacific Hotels', 4.3, 'Sydney', 'Australia', '88 Cumberland Street', -33.8688, 151.2093, 'Harbor View', 1, 30.0, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('S102', 'DOUBLE', 2, 219.99, 'Deluxe room with Opera House view', 'Harbor View Sydney', 'Pacific Hotels', 4.3, 'Sydney', 'Australia', '88 Cumberland Street', -33.8688, 151.2093, 'Opera House View', 1, 42.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('S201', 'SUITE', 4, 499.99, 'Luxury harbor suite with private terrace', 'Harbor View Sydney', 'Pacific Hotels', 4.3, 'Sydney', 'Australia', '88 Cumberland Street', -33.8688, 151.2093, 'Harbor View', 2, 80.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('S301', 'DELUXE', 2, 329.99, 'Premium room with Bridge view and spa bath', 'Harbor View Sydney', 'Pacific Hotels', 4.3, 'Sydney', 'Australia', '88 Cumberland Street', -33.8688, 151.2093, 'Bridge View', 3, 48.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Dubai Luxury Resort
('D101', 'DOUBLE', 2, 299.99, 'Desert view room with traditional Arabic design', 'Desert Pearl Dubai', 'Emirates Luxury', 4.7, 'Dubai', 'United Arab Emirates', 'Sheikh Zayed Road', 25.2048, 55.2708, 'Desert View', 1, 45.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('D102', 'SUITE', 4, 699.99, 'Royal suite with gold accents and city skyline view', 'Desert Pearl Dubai', 'Emirates Luxury', 4.7, 'Dubai', 'United Arab Emirates', 'Sheikh Zayed Road', 25.2048, 55.2708, 'City View', 1, 100.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('D201', 'DELUXE', 2, 449.99, 'Luxury room with Burj Khalifa view', 'Desert Pearl Dubai', 'Emirates Luxury', 4.7, 'Dubai', 'United Arab Emirates', 'Sheikh Zayed Road', 25.2048, 55.2708, 'Burj View', 2, 55.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('D301', 'FAMILY', 6, 549.99, 'Family suite with pool access and marina view', 'Desert Pearl Dubai', 'Emirates Luxury', 4.7, 'Dubai', 'United Arab Emirates', 'Sheikh Zayed Road', 25.2048, 55.2708, 'Marina View', 3, 85.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Singapore Business Hotel
('SG101', 'SINGLE', 1, 169.99, 'Executive single room with business center access', 'Marina Business Singapore', 'Business Collection', 4.4, 'Singapore', 'Singapore', '10 Marina Boulevard', 1.3521, 103.8198, 'Marina View', 1, 32.0, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SG102', 'DOUBLE', 2, 239.99, 'Premium business room with Gardens by the Bay view', 'Marina Business Singapore', 'Business Collection', 4.4, 'Singapore', 'Singapore', '10 Marina Boulevard', 1.3521, 103.8198, 'Garden View', 1, 40.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SG201', 'SUITE', 4, 549.99, 'Executive suite with meeting room and infinity pool access', 'Marina Business Singapore', 'Business Collection', 4.4, 'Singapore', 'Singapore', '10 Marina Boulevard', 1.3521, 103.8198, 'City View', 2, 75.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SG301', 'DELUXE', 2, 359.99, 'Deluxe room with Merlion view and executive lounge access', 'Marina Business Singapore', 'Business Collection', 4.4, 'Singapore', 'Singapore', '10 Marina Boulevard', 1.3521, 103.8198, 'Merlion View', 3, 50.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Additional rooms for more variety
('B401', 'SINGLE', 1, 79.99, 'Budget-friendly single room with essential amenities', 'Budget Inn Barcelona', 'Economy Chain', 3.5, 'Barcelona', 'Spain', 'Carrer de Pelai 22', 41.3851, 2.1734, 'Street View', 4, 20.0, false, true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('B402', 'DOUBLE', 2, 119.99, 'Comfortable double room with shared balcony', 'Budget Inn Barcelona', 'Economy Chain', 3.5, 'Barcelona', 'Spain', 'Carrer de Pelai 22', 41.3851, 2.1734, 'Courtyard View', 4, 28.0, true, true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('F501', 'FAMILY', 4, 189.99, 'Family room with kitchenette and separate sleeping areas', 'Family Resort Miami', 'Family Hotels', 3.8, 'Miami', 'United States', '2025 Biscayne Boulevard', 25.7617, -80.1918, 'Pool View', 5, 60.0, false, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('F502', 'SUITE', 6, 349.99, 'Two-bedroom family suite with living area', 'Family Resort Miami', 'Family Hotels', 3.8, 'Miami', 'United States', '2025 Biscayne Boulevard', 25.7617, -80.1918, 'Ocean View', 5, 85.0, true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert room amenities
INSERT INTO room_amenities (room_id, amenity) VALUES
-- Grand Hotel Barcelona amenities
(1, 'Free WiFi'), (1, 'Air Conditioning'), (1, 'Minibar'), (1, 'Safe'), (1, 'Flat Screen TV'),
(2, 'Free WiFi'), (2, 'Air Conditioning'), (2, 'Minibar'), (2, 'Safe'), (2, 'Flat Screen TV'), (2, 'Balcony'),
(3, 'Free WiFi'), (3, 'Air Conditioning'), (3, 'Minibar'), (3, 'Safe'), (3, 'Flat Screen TV'), (3, 'Balcony'), (3, 'Living Area'), (3, 'Jacuzzi'),
(4, 'Free WiFi'), (4, 'Air Conditioning'), (4, 'Minibar'), (4, 'Safe'), (4, 'Flat Screen TV'), (4, 'Balcony'), (4, 'Mountain View'),

-- Hotel Ritz Madrid amenities
(5, 'Free WiFi'), (5, 'Air Conditioning'), (5, 'Minibar'), (5, 'Safe'), (5, 'Flat Screen TV'), (5, 'Marble Bathroom'),
(6, 'Free WiFi'), (6, 'Air Conditioning'), (6, 'Minibar'), (6, 'Safe'), (6, 'Flat Screen TV'), (6, 'Balcony'), (6, 'Palace View'),
(7, 'Free WiFi'), (7, 'Air Conditioning'), (7, 'Minibar'), (7, 'Safe'), (7, 'Flat Screen TV'), (7, 'Balcony'), (7, 'Marble Bathroom'), (7, 'Terrace'),
(8, 'Free WiFi'), (8, 'Air Conditioning'), (8, 'Minibar'), (8, 'Safe'), (8, 'Flat Screen TV'), (8, 'Balcony'), (8, 'Connecting Rooms'),

-- Continue with more amenities for other hotels...
(9, 'Free WiFi'), (9, 'Air Conditioning'), (9, 'Beach Access'), (9, 'Ocean View'), (9, 'Balcony'),
(10, 'Free WiFi'), (10, 'Air Conditioning'), (10, 'Beach Access'), (10, 'Ocean View'), (10, 'Balcony'), (10, 'Private Pool'),
(11, 'Free WiFi'), (11, 'Air Conditioning'), (11, 'Beach Access'), (11, 'Ocean View'), (11, 'Balcony'), (11, 'Premium Amenities'),
(12, 'Free WiFi'), (12, 'Air Conditioning'), (12, 'Beach Access'), (12, 'Ocean View'), (12, 'Balcony'), (12, 'Kitchenette');

-- Insert room images
INSERT INTO room_images (room_id, image_url) VALUES
-- Grand Hotel Barcelona
(1, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'),
(1, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'),
(2, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop'),
(2, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'),
(3, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'),
(3, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'),
(4, 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop'),
(4, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'),

-- Hotel Ritz Madrid
(5, 'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800&h=600&fit=crop'),
(5, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'),
(6, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop'),
(6, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'),
(7, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'),
(7, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'),
(8, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop'),
(8, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'),

-- Seaside Resort Miami
(9, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'),
(9, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'),
(10, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'),
(10, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'),
(11, 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop'),
(11, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'),
(12, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop'),
(12, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop');

-- Insert features
INSERT INTO features (name, icon, is_active, created_at, updated_at) VALUES
('Breakfast', 'breakfast', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ocean View', 'ocean_view', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pet Friendly', 'pet_friendly', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gym Access', 'gym', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Spa Included', 'spa', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Airport Shuttle', 'shuttle', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Late Checkout', 'late_checkout', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Wheelchair Accessible', 'accessible', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Link rooms with features
INSERT INTO room_features (room_id, feature_id) VALUES
(1, 1), (1, 4),
(2, 1), (2, 5),
(3, 2), (3, 5),
(4, 3),
(5, 1), (5, 6),
(6, 2), (6, 7),
(7, 5),
(8, 3), (8, 4),
(9, 2),
(10, 1), (10, 8),
(11, 6),
(12, 7);

-- Link rooms with categories
UPDATE rooms SET category_id = 2 WHERE room_number IN ('101','102','201','301','M101','M102','M201','M301','P101','P102','P201','P301','L101','L102','L201','L301','NY101','NY102','NY201','NY301','R101','R102','R201','R301');
UPDATE rooms SET category_id = 1 WHERE room_number IN ('MI101','MI102','MI201','MI301','S101','S102','S201','S301','F501','F502');
UPDATE rooms SET category_id = 3 WHERE room_number IN ('Z101','Z102','Z201','Z301');
UPDATE rooms SET category_id = 4 WHERE room_number IN ('SG101','SG102','SG201','SG301','D101','D102','D201','D301');