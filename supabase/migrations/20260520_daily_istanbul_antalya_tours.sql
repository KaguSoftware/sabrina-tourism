-- Add Antalya to the allowed regions, then insert 10 new daily packages.

ALTER TABLE daily_packages
  DROP CONSTRAINT IF EXISTS daily_packages_region_check;

ALTER TABLE daily_packages
  ADD CONSTRAINT daily_packages_region_check
    CHECK (region IN (
      'Istanbul','Cappadocia','Aegean',
      'Mediterranean','Black Sea','Eastern Anatolia','Antalya'
    ));

-- ─── ISTANBUL ────────────────────────────────────────────────

INSERT INTO daily_packages (slug,name,tour_date,start_time,end_time,hero_image,card_image,vehicle,driver,price,currency,short_description,region,is_published,sort_order)
VALUES
('princes-islands','Princes Islands Day Trip','2026-06-15','09:00','20:00',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'Private Transfer','Ahmet',150,'USD',
 'Escape the city on a ferry to the car-free Princes Islands — pine-shaded paths, horse-drawn carriages, and fresh seafood by the sea.',
 'Istanbul',true,10)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM daily_packages WHERE slug='princes-islands';
  INSERT INTO daily_package_stops (package_id,stop_time,place,description,sort_order) VALUES
    (v_id,'09:00','Hotel Pickup','Your driver meets you at the lobby.',0),
    (v_id,'09:30','Kabataş Ferry Terminal','Board the public ferry to Büyükada.',1),
    (v_id,'10:30','Büyükada — Princes Islands','Explore the largest island by horse-drawn carriage or bicycle.',2),
    (v_id,'13:00','Lunch — Waterfront Restaurant','Fresh fish and mezes at a seaside table.',3),
    (v_id,'15:00','Free Exploration','Stroll the Victorian villas and pine forests at your own pace.',4),
    (v_id,'17:30','Return Ferry','Evening ferry back to the European shore.',5),
    (v_id,'20:00','Hotel Drop-off','Return to your accommodation.',6)
  ON CONFLICT DO NOTHING;
  INSERT INTO daily_package_included (package_id,text,sort_order) VALUES
    (v_id,'Private transfer to/from ferry terminal',0),
    (v_id,'Return ferry tickets',1),
    (v_id,'Horse-drawn carriage or bicycle hire',2),
    (v_id,'Licensed English-speaking guide',3),
    (v_id,'Bottled water throughout the day',4)
  ON CONFLICT DO NOTHING;
END $$;

INSERT INTO daily_packages (slug,name,tour_date,start_time,end_time,hero_image,card_image,vehicle,driver,price,currency,short_description,region,is_published,sort_order)
VALUES
('sapanca-masukiye','Sapanca & Maşukiye Nature Day','2026-06-20','08:30','20:00',
 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
 'Mercedes-Benz Vito','Kerem',140,'USD',
 'Lakeside serenity and mountain waterfalls — a refreshing escape to Sapanca Lake and the lush Maşukiye valley.',
 'Istanbul',true,11)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM daily_packages WHERE slug='sapanca-masukiye';
  INSERT INTO daily_package_stops (package_id,stop_time,place,description,sort_order) VALUES
    (v_id,'08:30','Hotel Pickup','Comfortable departure from your hotel.',0),
    (v_id,'10:30','Sapanca Lake','Scenic stop at the crystal-clear lake with mountain backdrop.',1),
    (v_id,'12:00','Maşukiye Village','Explore the charming highland village and its waterfall.',2),
    (v_id,'13:00','Lunch — Trout Farm Restaurant','Fresh trout and local dishes by the stream.',3),
    (v_id,'15:00','Free Time in Nature','Walks along the forest paths and streams.',4),
    (v_id,'17:00','Return Drive','Scenic drive back to Istanbul.',5),
    (v_id,'20:00','Hotel Drop-off','Safe return to your accommodation.',6)
  ON CONFLICT DO NOTHING;
  INSERT INTO daily_package_included (package_id,text,sort_order) VALUES
    (v_id,'Private Mercedes-Benz Vito with professional driver',0),
    (v_id,'Licensed English-speaking guide',1),
    (v_id,'Lunch at trout farm restaurant',2),
    (v_id,'Bottled water throughout the day',3)
  ON CONFLICT DO NOTHING;
END $$;

INSERT INTO daily_packages (slug,name,tour_date,start_time,end_time,hero_image,card_image,vehicle,driver,price,currency,short_description,region,is_published,sort_order)
VALUES
('istanbul-asian-side','Asian Side of Istanbul','2026-06-22','09:00','20:00',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'Private Transfer','Emre',130,'USD',
 'Cross the Bosphorus and discover Istanbul''s calmer, leafy Asian shore — Kadıköy markets, Moda cafés, and the Maiden''s Tower at sunset.',
 'Istanbul',true,12)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM daily_packages WHERE slug='istanbul-asian-side';
  INSERT INTO daily_package_stops (package_id,stop_time,place,description,sort_order) VALUES
    (v_id,'09:00','Hotel Pickup','Your guide meets you at the lobby.',0),
    (v_id,'09:45','Üsküdar','Visit the hilltop mosques and Bosphorus promenade.',1),
    (v_id,'11:00','Kadıköy Market','Wander the lively food market and historic bazaar streets.',2),
    (v_id,'13:00','Lunch — Kadıköy','Lunch at a local restaurant in the heart of the Asian side.',3),
    (v_id,'14:30','Moda & Bağdat Avenue','Explore the charming café culture and boutiques.',4),
    (v_id,'17:00','Maiden''s Tower (Kız Kulesi)','View the iconic tower at golden hour from the waterfront.',5),
    (v_id,'18:30','Ferry Back','Return ferry crossing to the European side.',6),
    (v_id,'20:00','Hotel Drop-off','Return to your accommodation.',7)
  ON CONFLICT DO NOTHING;
  INSERT INTO daily_package_included (package_id,text,sort_order) VALUES
    (v_id,'Private transfer with professional driver',0),
    (v_id,'Licensed English-speaking guide',1),
    (v_id,'Ferry tickets',2),
    (v_id,'Bottled water throughout the day',3)
  ON CONFLICT DO NOTHING;
END $$;

INSERT INTO daily_packages (slug,name,tour_date,start_time,end_time,hero_image,card_image,vehicle,driver,price,currency,short_description,region,is_published,sort_order)
VALUES
('istanbul-european-side','European Side of Istanbul','2026-06-24','09:00','21:00',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'Mercedes-Benz V-Class','Hasan',160,'USD',
 'The full sweep of Istanbul''s European heart — Hagia Sophia, Grand Bazaar, Galata Tower, and a Bosphorus evening cruise.',
 'Istanbul',true,13)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM daily_packages WHERE slug='istanbul-european-side';
  INSERT INTO daily_package_stops (package_id,stop_time,place,description,sort_order) VALUES
    (v_id,'09:00','Hotel Pickup','Start of your European Istanbul experience.',0),
    (v_id,'09:30','Hagia Sophia','Explore the iconic Byzantine basilica.',1),
    (v_id,'11:00','Blue Mosque','Admire the six minarets of this Ottoman masterpiece.',2),
    (v_id,'12:30','Grand Bazaar','Free time to browse 4,000 shops under vaulted ceilings.',3),
    (v_id,'14:00','Lunch — Beyoğlu','Lunch in the vibrant neighbourhood of Beyoğlu.',4),
    (v_id,'15:30','Galata Tower','Panoramic views over the city from the medieval tower.',5),
    (v_id,'17:00','İstiklal Avenue','Stroll Europe''s busiest pedestrian boulevard.',6),
    (v_id,'19:00','Evening Bosphorus Cruise','Short evening cruise between two continents.',7),
    (v_id,'21:00','Hotel Drop-off','Return to your accommodation.',8)
  ON CONFLICT DO NOTHING;
  INSERT INTO daily_package_included (package_id,text,sort_order) VALUES
    (v_id,'Private Mercedes-Benz V-Class with professional driver',0),
    (v_id,'Licensed English-speaking guide',1),
    (v_id,'All entrance fees',2),
    (v_id,'Evening Bosphorus cruise tickets',3),
    (v_id,'Bottled water throughout the day',4)
  ON CONFLICT DO NOTHING;
END $$;

INSERT INTO daily_packages (slug,name,tour_date,start_time,end_time,hero_image,card_image,vehicle,driver,price,currency,short_description,region,is_published,sort_order)
VALUES
('istanbul-aquarium-florya','İstanbul Aquarium & Aqua Florya','2026-07-01','10:00','20:00',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'Private Transfer','Selim',120,'USD',
 'Dive into Europe''s largest aquarium with underwater tunnels and thousands of sea creatures, then explore the stylish Aqua Florya Mall on the seafront.',
 'Istanbul',true,14)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM daily_packages WHERE slug='istanbul-aquarium-florya';
  INSERT INTO daily_package_stops (package_id,stop_time,place,description,sort_order) VALUES
    (v_id,'10:00','Hotel Pickup','Comfortable transfer to Florya.',0),
    (v_id,'10:45','İstanbul Aquarium','Explore Europe''s largest aquarium — underwater tunnels, shark tanks, and tropical exhibits.',1),
    (v_id,'13:00','Lunch — Aqua Florya Food Court','Wide selection of restaurants overlooking the sea.',2),
    (v_id,'14:30','Aqua Florya Shopping Mall','Afternoon shopping at the seafront mall.',3),
    (v_id,'18:00','Seaside Walk','Stroll along the Florya seafront promenade.',4),
    (v_id,'20:00','Hotel Drop-off','Return to your accommodation.',5)
  ON CONFLICT DO NOTHING;
  INSERT INTO daily_package_included (package_id,text,sort_order) VALUES
    (v_id,'Private transfer with professional driver',0),
    (v_id,'İstanbul Aquarium entrance tickets',1),
    (v_id,'Bottled water throughout the day',2)
  ON CONFLICT DO NOTHING;
END $$;

INSERT INTO daily_packages (slug,name,tour_date,start_time,end_time,hero_image,card_image,vehicle,driver,price,currency,short_description,region,is_published,sort_order)
VALUES
('vialand-theme-park','Vialand Theme Park & Shopping Mall','2026-07-05','09:30','21:00',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'Private Transfer','Yusuf',130,'USD',
 'A full day of thrills at Vialand — Istanbul''s premier theme park — followed by an evening at the adjacent shopping and entertainment complex.',
 'Istanbul',true,15)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM daily_packages WHERE slug='vialand-theme-park';
  INSERT INTO daily_package_stops (package_id,stop_time,place,description,sort_order) VALUES
    (v_id,'09:30','Hotel Pickup','Transfer to Vialand.',0),
    (v_id,'10:00','Vialand Theme Park','Full day access to rides, roller coasters, and family attractions.',1),
    (v_id,'13:30','Lunch — Theme Park Restaurant','Break for lunch inside the park.',2),
    (v_id,'15:00','Continue at the Park','Enjoy the afternoon rides and shows.',3),
    (v_id,'18:00','Vialand Shopping Mall','Explore the connected mall and entertainment centre.',4),
    (v_id,'21:00','Hotel Drop-off','Return to your accommodation.',5)
  ON CONFLICT DO NOTHING;
  INSERT INTO daily_package_included (package_id,text,sort_order) VALUES
    (v_id,'Private transfer with professional driver',0),
    (v_id,'Vialand Theme Park entrance tickets',1),
    (v_id,'Bottled water throughout the day',2)
  ON CONFLICT DO NOTHING;
END $$;

INSERT INTO daily_packages (slug,name,tour_date,start_time,end_time,hero_image,card_image,vehicle,driver,price,currency,short_description,region,is_published,sort_order)
VALUES
('sile-agva','Şile & Ağva Black Sea Day','2026-07-08','08:00','21:00',
 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
 'Mercedes-Benz Vito','Baran',145,'USD',
 'A scenic drive along the Black Sea coast to Şile''s lighthouse beach and the tranquil river village of Ağva.',
 'Istanbul',true,16)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM daily_packages WHERE slug='sile-agva';
  INSERT INTO daily_package_stops (package_id,stop_time,place,description,sort_order) VALUES
    (v_id,'08:00','Hotel Pickup','Early departure to beat traffic.',0),
    (v_id,'10:00','Şile Town & Lighthouse','Visit the historic lighthouse and the sandy Black Sea beach.',1),
    (v_id,'12:00','Şile Bazaar','Browse the famous handwoven Şile cloth and local crafts.',2),
    (v_id,'13:00','Lunch — Seaside Restaurant','Fresh Black Sea fish lunch.',3),
    (v_id,'14:30','Drive to Ağva','Scenic coastal road through pine forests.',4),
    (v_id,'15:30','Ağva Village','Explore the tranquil village where two rivers meet the sea.',5),
    (v_id,'18:00','Return Drive','Scenic return to Istanbul.',6),
    (v_id,'21:00','Hotel Drop-off','Return to your accommodation.',7)
  ON CONFLICT DO NOTHING;
  INSERT INTO daily_package_included (package_id,text,sort_order) VALUES
    (v_id,'Private Mercedes-Benz Vito with professional driver',0),
    (v_id,'Licensed English-speaking guide',1),
    (v_id,'Lunch at seaside restaurant',2),
    (v_id,'Bottled water throughout the day',3)
  ON CONFLICT DO NOTHING;
END $$;

-- ─── ANTALYA ─────────────────────────────────────────────────

INSERT INTO daily_packages (slug,name,tour_date,start_time,end_time,hero_image,card_image,vehicle,driver,price,currency,short_description,region,is_published,sort_order)
VALUES
('antalya-city-cruise','Antalya City Tour & Cruise','2026-07-12','09:00','21:00',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'Mercedes-Benz Sprinter','Ali',180,'USD',
 'The best of Antalya in one day — ancient Kaleiçi, Hadrian''s Gate, and a Mediterranean cruise along the turquoise coastline.',
 'Antalya',true,20)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM daily_packages WHERE slug='antalya-city-cruise';
  INSERT INTO daily_package_stops (package_id,stop_time,place,description,sort_order) VALUES
    (v_id,'09:00','Hotel Pickup','Comfortable departure from your hotel.',0),
    (v_id,'09:30','Kaleiçi — Old City','Walk the cobblestone lanes of Antalya''s historic quarter.',1),
    (v_id,'10:30','Hadrian''s Gate','Pass through the monumental Roman triumphal arch.',2),
    (v_id,'11:15','Antalya Museum','Highlights of the world-class archaeological museum.',3),
    (v_id,'13:00','Lunch — Harbour Restaurant','Fresh seafood lunch overlooking the Roman harbour.',4),
    (v_id,'14:30','Mediterranean Cruise','A leisurely boat cruise along the Antalya coastline.',5),
    (v_id,'17:00','Düden Waterfall','The dramatic waterfall that tumbles directly into the sea.',6),
    (v_id,'19:00','Dinner — Old City','Dinner at a rooftop restaurant in Kaleiçi.',7),
    (v_id,'21:00','Hotel Drop-off','Return to your accommodation.',8)
  ON CONFLICT DO NOTHING;
  INSERT INTO daily_package_included (package_id,text,sort_order) VALUES
    (v_id,'Private Mercedes-Benz Sprinter with professional driver',0),
    (v_id,'Licensed English-speaking guide',1),
    (v_id,'Museum entrance fees',2),
    (v_id,'Mediterranean cruise tickets',3),
    (v_id,'Lunch and dinner',4),
    (v_id,'Bottled water throughout the day',5)
  ON CONFLICT DO NOTHING;
END $$;

INSERT INTO daily_packages (slug,name,tour_date,start_time,end_time,hero_image,card_image,vehicle,driver,price,currency,short_description,region,is_published,sort_order)
VALUES
('antalya-rafting','Antalya Rafting Day Trip','2026-07-15','08:00','19:00',
 'https://images.unsplash.com/photo-1530866926602-bde218ef1f4e?w=1200&q=80',
 'https://images.unsplash.com/photo-1530866926602-bde218ef1f4e?w=1200&q=80',
 'Mercedes-Benz Sprinter','Murat',160,'USD',
 'White-water rafting on the Köprüçay River through the Taurus Mountains — the most thrilling rapids in Turkey.',
 'Antalya',true,21)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM daily_packages WHERE slug='antalya-rafting';
  INSERT INTO daily_package_stops (package_id,stop_time,place,description,sort_order) VALUES
    (v_id,'08:00','Hotel Pickup','Early departure from your hotel.',0),
    (v_id,'09:30','Köprülü Canyon National Park','Arrive at the stunning canyon with its Roman bridge.',1),
    (v_id,'10:00','Safety Briefing & Gear Up','Equipment fitting and rafting guide instructions.',2),
    (v_id,'10:30','White-Water Rafting','3-hour rafting on the Köprüçay River through the canyon.',3),
    (v_id,'13:30','Riverside Lunch','Traditional Turkish barbecue lunch by the river.',4),
    (v_id,'15:00','Free Time & Swimming','Relax and swim in the clear river waters.',5),
    (v_id,'16:00','Return Drive','Scenic return to Antalya.',6),
    (v_id,'19:00','Hotel Drop-off','Return to your accommodation.',7)
  ON CONFLICT DO NOTHING;
  INSERT INTO daily_package_included (package_id,text,sort_order) VALUES
    (v_id,'Private Mercedes-Benz Sprinter with professional driver',0),
    (v_id,'Professional rafting guide and safety equipment',1),
    (v_id,'Riverside barbecue lunch',2),
    (v_id,'Bottled water throughout the day',3)
  ON CONFLICT DO NOTHING;
END $$;

INSERT INTO daily_packages (slug,name,tour_date,start_time,end_time,hero_image,card_image,vehicle,driver,price,currency,short_description,region,is_published,sort_order)
VALUES
('land-of-legends','Evening Tour — The Land of Legends','2026-07-18','16:00','23:30',
 'https://images.unsplash.com/photo-1563252722-6434563a985d?w=1200&q=80',
 'https://images.unsplash.com/photo-1563252722-6434563a985d?w=1200&q=80',
 'Private Transfer','Serkan',140,'USD',
 'An enchanting evening at the Land of Legends theme park — live shows, dazzling light displays, and world-class entertainment under the Mediterranean sky.',
 'Antalya',true,22)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM daily_packages WHERE slug='land-of-legends';
  INSERT INTO daily_package_stops (package_id,stop_time,place,description,sort_order) VALUES
    (v_id,'16:00','Hotel Pickup','Evening transfer to The Land of Legends.',0),
    (v_id,'17:00','Arrival — The Land of Legends','Enter the premier entertainment resort of Belek.',1),
    (v_id,'17:30','Theme Park Rides','Enjoy the park''s thrilling rides and attractions.',2),
    (v_id,'19:30','Dinner — Park Restaurant','Dinner at one of the park''s themed restaurants.',3),
    (v_id,'21:00','Live Shows & Performances','World-class live shows, acrobatics, and theatrical performances.',4),
    (v_id,'22:30','Light & Fountain Show','The spectacular nightly light and water display.',5),
    (v_id,'23:30','Hotel Drop-off','Return to your accommodation.',6)
  ON CONFLICT DO NOTHING;
  INSERT INTO daily_package_included (package_id,text,sort_order) VALUES
    (v_id,'Private transfer with professional driver',0),
    (v_id,'The Land of Legends entrance tickets',1),
    (v_id,'Dinner at park restaurant',2),
    (v_id,'All show and performance access',3),
    (v_id,'Bottled water throughout the evening',4)
  ON CONFLICT DO NOTHING;
END $$;
