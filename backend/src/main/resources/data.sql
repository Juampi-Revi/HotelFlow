-- Insert sample rooms data
INSERT INTO rooms (room_number, room_type, capacity, price_per_night, description, is_available, created_at, updated_at) VALUES
('101', 'SINGLE', 1, 89.99, 'Habitación individual cómoda con vista al jardín. Perfecta para viajeros de negocios o turistas que buscan tranquilidad.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('102', 'DOUBLE', 2, 129.99, 'Habitación doble elegante con cama king size y balcón privado. Ideal para parejas en escapada romántica.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('201', 'SUITE', 4, 299.99, 'Suite de lujo con sala de estar separada, jacuzzi y vista panorámica de la ciudad. La experiencia definitiva de confort.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('202', 'FAMILY', 6, 199.99, 'Habitación familiar espaciosa con literas y área de juegos. Perfecta para familias con niños.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('301', 'DELUXE', 2, 249.99, 'Habitación deluxe con decoración moderna, minibar premium y servicio de habitaciones 24/7.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('302', 'SINGLE', 1, 79.99, 'Habitación individual económica pero confortable, ideal para estancias cortas de trabajo.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('401', 'DOUBLE', 2, 149.99, 'Habitación doble superior con terraza privada y vista al mar. Incluye desayuno continental.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('402', 'SUITE', 4, 349.99, 'Suite presidencial con dos dormitorios, cocina completa y sala de reuniones privada.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('501', 'FAMILY', 8, 279.99, 'Habitación familiar premium con dos dormitorios conectados y área de entretenimiento.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('502', 'DELUXE', 2, 219.99, 'Habitación deluxe con bañera de hidromasaje y vista panorámica de las montañas.', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert room images
INSERT INTO room_images (room_id, image_url) VALUES
-- Room 101 (SINGLE)
(1, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'),
(1, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'),
(1, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'),
(1, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'),
(1, 'https://images.unsplash.com/photo-1540518614846-7eded1c3b9e1?w=800&h=600&fit=crop'),
(1, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop'),
-- Room 102 (DOUBLE)
(2, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop'),
(2, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'),
-- Room 201 (SUITE)
(3, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'),
(3, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'),
-- Room 202 (FAMILY)
(4, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop'),
(4, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'),
-- Room 301 (DELUXE)
(5, 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop'),
(5, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'),
-- Room 302 (SINGLE)
(6, 'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800&h=600&fit=crop'),
(6, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'),
-- Room 401 (DOUBLE)
(7, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop'),
(7, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'),
-- Room 402 (SUITE)
(8, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'),
(8, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'),
-- Room 501 (FAMILY)
(9, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop'),
(9, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'),
-- Room 502 (DELUXE)
(10, 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop'),
(10, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop');