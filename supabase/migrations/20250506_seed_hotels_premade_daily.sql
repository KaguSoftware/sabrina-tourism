-- =============================================================
-- Seed: Hotels, Premade Packages, Daily Packages
-- Mirrors the static data files. Safe to re-run (ON CONFLICT DO NOTHING).
-- =============================================================


-- -------------------------------------------------------------
-- HOTELS
-- -------------------------------------------------------------

-- Istanbul: Bosphorus Manor
INSERT INTO hotels (slug,name,region,description,long_description,tag_a,tag_b,svg_variant,location,bedroom_image,check_in_time,check_out_time,languages,distance_km,bedrooms,bathrooms,free_wifi,free_cancellation,free_parking,bed_breakfast,balcony,washer,ac,tv,is_published,sort_order)
VALUES ('bosphorus-manor','Bosphorus Manor','Istanbul','An 1890s Ottoman mansion overlooking the strait, restored to its original grandeur with a private hammam and terrace suites facing the water.','Perched above the shimmering Bosphorus strait, this meticulously restored Ottoman mansion dates to 1893. Original marble floors, hand-carved walnut screens, and stained-glass transoms have been preserved alongside discreetly modern comforts. Each suite faces the water; at dawn, the twin minarets of the Asian shore emerge from the mist across the channel. A private hammam occupies the former caretaker''s quarters, and the terrace is set for breakfast from the moment the first ferries cross.','Boutique','Waterfront','ottoman','Beşiktaş, Istanbul','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80','15:00','12:00',ARRAY['English','Turkish','Arabic'],6,1,1,true,true,false,true,true,false,true,true,true,0)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM hotels WHERE slug='bosphorus-manor';
  INSERT INTO hotel_amenities (hotel_id,text,is_property,sort_order) VALUES
    (v_id,'Private Hammam',false,0),(v_id,'Terrace Suites',false,1),(v_id,'Bosphorus Views',false,2),(v_id,'Butler Service',false,3),(v_id,'Airport Transfer',false,4)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_images (hotel_id,url,label,sort_order) VALUES
    (v_id,'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80','Exterior',0),
    (v_id,'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80','Bedroom',1),
    (v_id,'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80','Bathroom',2),
    (v_id,'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80','View',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_room_types (hotel_id,name,capacity,beds,size,image_index,highlights,sort_order) VALUES
    (v_id,'Bosphorus Suite',2,'1 king bed','42 m²',1,ARRAY['Strait view','Private hammam access','Butler service'],0),
    (v_id,'Terrace Room',2,'1 queen bed','30 m²',0,ARRAY['Private terrace','Garden view','Breakfast included'],1)
  ON CONFLICT DO NOTHING;
END $$;

-- Istanbul: Sultanahmet Residences
INSERT INTO hotels (slug,name,region,description,long_description,tag_a,tag_b,svg_variant,location,bedroom_image,check_in_time,check_out_time,languages,distance_km,bedrooms,bathrooms,free_wifi,free_cancellation,free_parking,bed_breakfast,balcony,washer,ac,tv,is_published,sort_order)
VALUES ('sultanahmet-residences','Sultanahmet Residences','Istanbul','Steps from the Blue Mosque, these converted Byzantine townhouses marry thousand-year-old stone walls with quietly modern comforts.','Set within a cluster of converted Byzantine townhouses in the heart of the old city, the Sultanahmet Residences place guests within a five-minute walk of the Blue Mosque, Hagia Sophia, and the Grand Bazaar. Thousand-year-old stone walls enclose rooms of calm linen, dark timber, and hand-thrown ceramics. Mornings begin on the shared rooftop terrace as the call to prayer drifts across the domes and the city stirs below.','Heritage','Old City','mansion','Sultanahmet, Istanbul','https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80','14:00','11:00',ARRAY['English','Turkish','German'],1,2,1,true,false,false,false,false,true,true,false,true,1)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM hotels WHERE slug='sultanahmet-residences';
  INSERT INTO hotel_amenities (hotel_id,text,is_property,sort_order) VALUES
    (v_id,'Rooftop Terrace',false,0),(v_id,'Heritage Architecture',false,1),(v_id,'Walking Distance to Monuments',false,2),(v_id,'Concierge',false,3),(v_id,'Hammam Access',false,4)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_images (hotel_id,url,label,sort_order) VALUES
    (v_id,'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&q=80','Exterior',0),
    (v_id,'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80','Bedroom',1),
    (v_id,'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80','Bathroom',2),
    (v_id,'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200&q=80','View',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_room_types (hotel_id,name,capacity,beds,size,image_index,highlights,sort_order) VALUES
    (v_id,'Heritage Double',2,'1 double bed','26 m²',1,ARRAY['Stone-walled room','Rooftop terrace access','Near Blue Mosque'],0),
    (v_id,'Family Suite',4,'2 double beds','48 m²',0,ARRAY['Two bedrooms','Panoramic old-city view','Washing machine'],1)
  ON CONFLICT DO NOTHING;
END $$;

-- Cappadocia: Göreme Cave Lodge
INSERT INTO hotels (slug,name,region,description,long_description,tag_a,tag_b,svg_variant,location,bedroom_image,check_in_time,check_out_time,languages,distance_km,bedrooms,bathrooms,free_wifi,free_cancellation,free_parking,bed_breakfast,balcony,washer,ac,tv,is_published,sort_order)
VALUES ('goreme-cave-lodge','Göreme Cave Lodge','Cappadocia','Hand-carved suites set directly into volcanic tuff, each opening onto a private terrace that faces the valley as the first balloons rise at dawn.','Each suite at Göreme Cave Lodge was carved by hand from the pale volcanic tuff that defines this extraordinary landscape. The walls hold a natural warmth in winter and a cool stillness in summer. Private terraces open directly onto the Rose Valley, and at 5:30 each morning the first balloons lift from the fields below — a sight that never loses its wonder. Dinner is served in a rock-cut dining room lit entirely by candlelight.','Cave Suite','Valley View','cave','Göreme, Cappadocia','https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80','15:00','11:00',ARRAY['English','Turkish'],3,1,1,true,true,true,true,true,false,false,true,true,2)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM hotels WHERE slug='goreme-cave-lodge';
  INSERT INTO hotel_amenities (hotel_id,text,is_property,sort_order) VALUES
    (v_id,'Private Terraces',false,0),(v_id,'Balloon Views',false,1),(v_id,'Rock-Cut Dining',false,2),(v_id,'Sunrise Breakfast',false,3),(v_id,'Hot Tub',false,4)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_images (hotel_id,url,label,sort_order) VALUES
    (v_id,'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80','Exterior',0),
    (v_id,'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80','Bedroom',1),
    (v_id,'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80','Bathroom',2),
    (v_id,'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80','View',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_room_types (hotel_id,name,capacity,beds,size,image_index,highlights,sort_order) VALUES
    (v_id,'Cave Suite',2,'1 king bed','35 m²',1,ARRAY['Hand-carved tuff walls','Valley-facing terrace','Sunrise balloon views'],0),
    (v_id,'Standard Cave Room',2,'2 twin beds','22 m²',2,ARRAY['Natural cave cooling','Breakfast included','Hot tub access'],1)
  ON CONFLICT DO NOTHING;
END $$;

-- Cappadocia: Uçhisar Cliff Suites
INSERT INTO hotels (slug,name,region,description,long_description,tag_a,tag_b,svg_variant,location,bedroom_image,check_in_time,check_out_time,languages,distance_km,bedrooms,bathrooms,free_wifi,free_cancellation,free_parking,bed_breakfast,balcony,washer,ac,tv,is_published,sort_order)
VALUES ('uchisar-cliff-suites','Uçhisar Cliff Suites','Cappadocia','Cantilevered over the highest natural outcrop in Cappadocia, these suites offer a 360° panorama of the fairy chimney valleys below.','Uçhisar Cliff Suites occupies the summit of the highest natural rock formation in Cappadocia. Glass-fronted suites cantilever over the edge, delivering a 360° panorama of the fairy chimney valleys, the distant volcano of Erciyes, and a sky that turns amber, rose, and violet at dusk. A heated infinity pool sits at the cliff edge, seemingly suspended above the valley floor sixty metres below.','Clifftop','Panoramic','cave','Uçhisar, Cappadocia','https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80','16:00','12:00',ARRAY['English','Turkish','French'],7,2,2,false,true,true,false,true,true,true,false,true,3)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM hotels WHERE slug='uchisar-cliff-suites';
  INSERT INTO hotel_amenities (hotel_id,text,is_property,sort_order) VALUES
    (v_id,'Cliff-Edge Pool',false,0),(v_id,'360° Panorama',false,1),(v_id,'Heated Suites',false,2),(v_id,'Guided Valley Walks',false,3),(v_id,'Wine Cellar',false,4)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_images (hotel_id,url,label,sort_order) VALUES
    (v_id,'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=1200&q=80','Exterior',0),
    (v_id,'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80','Bedroom',1),
    (v_id,'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&q=80','Bathroom',2),
    (v_id,'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80','View',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_room_types (hotel_id,name,capacity,beds,size,image_index,highlights,sort_order) VALUES
    (v_id,'Panorama Suite',2,'1 king bed','50 m²',1,ARRAY['Glass-fronted cliff views','Heated suite','360° panorama'],0),
    (v_id,'Cliff Studio',2,'1 queen bed','32 m²',0,ARRAY['Valley & volcano views','Infinity pool access','Wine cellar access'],1),
    (v_id,'Twin Terrace',3,'1 double + 1 single','38 m²',3,ARRAY['Shared terrace','Guided walks','Mountain views'],2)
  ON CONFLICT DO NOTHING;
END $$;

-- Aegean: Alaçatı Stone House
INSERT INTO hotels (slug,name,region,description,long_description,tag_a,tag_b,svg_variant,location,bedroom_image,check_in_time,check_out_time,languages,distance_km,bedrooms,bathrooms,free_wifi,free_cancellation,free_parking,bed_breakfast,balcony,washer,ac,tv,is_published,sort_order)
VALUES ('alacati-stone-house','Alaçatı Stone House','Aegean','A 19th-century Greek stone house in the famous windmill village, with a courtyard plunge pool, lavender garden, and wind-swept terraces.','Built by a Greek merchant family in 1887, this stone house sits at the quiet end of Alaçatı''s famous cobblestone bazaar street. The courtyard, shaded by a centuries-old fig tree, holds a plunge pool surrounded by lavender beds in full bloom from May through August. The prevailing meltemi wind keeps terraces cool all summer. The village''s celebrated restaurants and boutiques are within a five-minute stroll.','Boutique','Village','aegean','Alaçatı, İzmir','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80','15:00','11:00',ARRAY['English','Turkish','Greek'],12,1,1,true,true,true,true,false,true,true,true,true,4)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM hotels WHERE slug='alacati-stone-house';
  INSERT INTO hotel_amenities (hotel_id,text,is_property,sort_order) VALUES
    (v_id,'Courtyard Pool',false,0),(v_id,'Lavender Garden',false,1),(v_id,'Stone Architecture',false,2),(v_id,'Village Location',false,3),(v_id,'Bicycle Hire',false,4)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_images (hotel_id,url,label,sort_order) VALUES
    (v_id,'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80','Exterior',0),
    (v_id,'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80','Bedroom',1),
    (v_id,'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80','Bathroom',2),
    (v_id,'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=80','View',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_room_types (hotel_id,name,capacity,beds,size,image_index,highlights,sort_order) VALUES
    (v_id,'Courtyard Room',2,'1 double bed','24 m²',0,ARRAY['Plunge pool access','Lavender garden','Breakfast included'],0),
    (v_id,'Garden Suite',3,'1 queen + 1 sofa bed','38 m²',1,ARRAY['Private garden access','Bicycle hire','Village views'],1)
  ON CONFLICT DO NOTHING;
END $$;

-- Aegean: Bodrum Harbour Suites
INSERT INTO hotels (slug,name,region,description,long_description,tag_a,tag_b,svg_variant,location,bedroom_image,check_in_time,check_out_time,languages,distance_km,bedrooms,bathrooms,free_wifi,free_cancellation,free_parking,bed_breakfast,balcony,washer,ac,tv,is_published,sort_order)
VALUES ('bodrum-harbour-suites','Bodrum Harbour Suites','Aegean','Whitewashed terraces step down the hillside to the Aegean marina, with the medieval Knights'' Castle rising behind every rooftop.','A cascade of whitewashed terraces descend from the hillside to the water''s edge at Bodrum harbour. Every suite has an uninterrupted view of the medieval Castle of St Peter, glowing amber each evening as the sun sets over the Aegean. Gulets bob in the marina below; private boat excursions to the surrounding bays and sea caves can be arranged daily. The pedestrian harbour promenade — Bodrum''s finest stretch for dining and people-watching — begins at the hotel gate.','Waterfront','Marina','coastal','Bodrum, Muğla','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80','14:00','12:00',ARRAY['English','Turkish','Italian'],4,2,1,true,false,false,false,true,false,true,true,true,5)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM hotels WHERE slug='bodrum-harbour-suites';
  INSERT INTO hotel_amenities (hotel_id,text,is_property,sort_order) VALUES
    (v_id,'Marina Views',false,0),(v_id,'Private Boat Hire',false,1),(v_id,'Sea-Facing Terraces',false,2),(v_id,'Beach Club Access',false,3),(v_id,'Castle Views',false,4)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_images (hotel_id,url,label,sort_order) VALUES
    (v_id,'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80','Exterior',0),
    (v_id,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80','Bedroom',1),
    (v_id,'https://images.unsplash.com/photo-1600566752447-5f6cd58e9f89?w=1200&q=80','Bathroom',2),
    (v_id,'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80','View',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_room_types (hotel_id,name,capacity,beds,size,image_index,highlights,sort_order) VALUES
    (v_id,'Harbour Suite',2,'1 king bed','45 m²',1,ARRAY['Castle & marina views','Private balcony','Boat excursion priority'],0),
    (v_id,'Sea-View Double',2,'1 double bed','28 m²',3,ARRAY['Aegean views','Beach club access','Promenade access'],1),
    (v_id,'Family Terrace',4,'2 double beds','55 m²',0,ARRAY['Two terraces','Two bathrooms','Castle panorama'],2)
  ON CONFLICT DO NOTHING;
END $$;

-- Mediterranean: Kalkan Bay Lodge
INSERT INTO hotels (slug,name,region,description,long_description,tag_a,tag_b,svg_variant,location,bedroom_image,check_in_time,check_out_time,languages,distance_km,bedrooms,bathrooms,free_wifi,free_cancellation,free_parking,bed_breakfast,balcony,washer,ac,tv,is_published,sort_order)
VALUES ('kalkan-bay-lodge','Kalkan Bay Lodge','Mediterranean','Cascading in white terraces down a clifftop above the bay, each suite comes with its own infinity plunge pool and an uninterrupted sea horizon.','Kalkan Bay Lodge is built into the cliff above one of the Mediterranean coast''s most beautiful small bays. Each of the twelve suites has its own private infinity plunge pool, positioned so that the water appears to merge seamlessly with the deep blue sea sixty metres below. The old quarter of Kalkan — cobblestoned streets, rooftop fish restaurants, and a small yacht harbour — is a ten-minute walk through the terraced hillside.','Clifftop','Infinity Pool','coastal','Kalkan, Antalya','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80','15:00','11:00',ARRAY['English','Turkish','Russian'],9,1,1,true,true,true,true,true,true,true,false,true,6)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM hotels WHERE slug='kalkan-bay-lodge';
  INSERT INTO hotel_amenities (hotel_id,text,is_property,sort_order) VALUES
    (v_id,'Private Plunge Pool',false,0),(v_id,'Sea-View Suites',false,1),(v_id,'Clifftop Location',false,2),(v_id,'Daily Boat Trips',false,3),(v_id,'Gourmet Dining',false,4)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_images (hotel_id,url,label,sort_order) VALUES
    (v_id,'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80','Exterior',0),
    (v_id,'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80','Bedroom',1),
    (v_id,'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80','Bathroom',2),
    (v_id,'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80','View',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_room_types (hotel_id,name,capacity,beds,size,image_index,highlights,sort_order) VALUES
    (v_id,'Infinity Suite',2,'1 king bed','55 m²',1,ARRAY['Private plunge pool','Cliff-edge position','Breakfast included'],0),
    (v_id,'Bay View Room',2,'1 queen bed','32 m²',3,ARRAY['Sea horizon views','Pool access','Daily boat trips'],1)
  ON CONFLICT DO NOTHING;
END $$;

-- Mediterranean: Kaş Harbour Inn
INSERT INTO hotels (slug,name,region,description,long_description,tag_a,tag_b,svg_variant,location,bedroom_image,check_in_time,check_out_time,languages,distance_km,bedrooms,bathrooms,free_wifi,free_cancellation,free_parking,bed_breakfast,balcony,washer,ac,tv,is_published,sort_order)
VALUES ('kas-harbour-inn','Kaş Harbour Inn','Mediterranean','A boutique harbour hotel built directly above Roman ruins, with direct access to some of the most celebrated dive sites on the coast.','In the narrow lanes of Kaş, a Lycian sarcophagus sits in the middle of a crossroads and a Roman theatre overlooks the Greek island of Meis — this is that kind of town. The Harbour Inn is built directly above a Roman cistern, its foundations intertwined with two thousand years of history. From the dive pontoon ten minutes by boat lie the sunken city of Kekova and some of the finest wreck and wall diving in the Mediterranean.','Boutique','Dive Base','aegean','Kaş, Antalya','https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80','15:00','11:00',ARRAY['English','Turkish'],2,1,1,false,true,false,false,true,false,true,true,true,7)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM hotels WHERE slug='kas-harbour-inn';
  INSERT INTO hotel_amenities (hotel_id,text,is_property,sort_order) VALUES
    (v_id,'Dive Centre',false,0),(v_id,'Roman Ruins On-Site',false,1),(v_id,'Sea Terrace',false,2),(v_id,'Snorkelling Trips',false,3),(v_id,'Rooftop Bar',false,4)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_images (hotel_id,url,label,sort_order) VALUES
    (v_id,'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200&q=80','Exterior',0),
    (v_id,'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80','Bedroom',1),
    (v_id,'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=1200&q=80','Bathroom',2),
    (v_id,'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80','View',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_room_types (hotel_id,name,capacity,beds,size,image_index,highlights,sort_order) VALUES
    (v_id,'Sea Terrace Room',2,'1 double bed','26 m²',1,ARRAY['Harbour views','Rooftop bar access','Dive centre priority'],0),
    (v_id,'Ruins Suite',2,'1 king bed','40 m²',0,ARRAY['Above Roman cistern','Historic setting','Snorkelling trips'],1)
  ON CONFLICT DO NOTHING;
END $$;

-- Black Sea: Rize Tea Plateau Lodge
INSERT INTO hotels (slug,name,region,description,long_description,tag_a,tag_b,svg_variant,location,bedroom_image,check_in_time,check_out_time,languages,distance_km,bedrooms,bathrooms,free_wifi,free_cancellation,free_parking,bed_breakfast,balcony,washer,ac,tv,is_published,sort_order)
VALUES ('rize-tea-plateau-lodge','Rize Tea Plateau Lodge','Black Sea','A restored Ottoman farmhouse perched on the mist-covered tea terraces above Rize, with a wood-burning fireplace suite and panoramic highland views.','The tea terraces above Rize are among the most intensely green landscapes in the world — every hillside a dense, manicured cascade of tea plants disappearing into low cloud. This restored Ottoman farmhouse sits among them at 800 metres altitude, its wide timber veranda looking out over successive ridges to the Black Sea far below. Evenings are spent beside the wood-burning fireplace with a glass of local çay; mornings smell of woodsmoke and fresh bread from the kitchen below.','Highland','Farmhouse','chalet','Rize Highlands','https://images.unsplash.com/photo-1464146072230-91cabc968266?w=1200&q=80','15:00','10:00',ARRAY['English','Turkish'],18,2,1,true,true,true,true,false,true,false,true,true,8)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM hotels WHERE slug='rize-tea-plateau-lodge';
  INSERT INTO hotel_amenities (hotel_id,text,is_property,sort_order) VALUES
    (v_id,'Wood Fireplace',false,0),(v_id,'Highland Views',false,1),(v_id,'Tea Terrace Walks',false,2),(v_id,'Farm Breakfast',false,3),(v_id,'Black Sea Panorama',false,4)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_images (hotel_id,url,label,sort_order) VALUES
    (v_id,'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80','Exterior',0),
    (v_id,'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=1200&q=80','Bedroom',1),
    (v_id,'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80','Bathroom',2),
    (v_id,'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=1200&q=80','View',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_room_types (hotel_id,name,capacity,beds,size,image_index,highlights,sort_order) VALUES
    (v_id,'Fireplace Room',2,'1 double bed','28 m²',1,ARRAY['Wood-burning fireplace','Highland views','Farm breakfast'],0),
    (v_id,'Highland Suite',4,'2 twin beds + loft','52 m²',0,ARRAY['Panoramic veranda','Black Sea view','Tea terrace walks'],1)
  ON CONFLICT DO NOTHING;
END $$;

-- Black Sea: Sinop Fortress Inn
INSERT INTO hotels (slug,name,region,description,long_description,tag_a,tag_b,svg_variant,location,bedroom_image,check_in_time,check_out_time,languages,distance_km,bedrooms,bathrooms,free_wifi,free_cancellation,free_parking,bed_breakfast,balcony,washer,ac,tv,is_published,sort_order)
VALUES ('sinop-fortress-inn','Sinop Fortress Inn','Black Sea','Rooms carved into the walls of a Byzantine sea fortress at the northernmost point of Türkiye, where the Black Sea stretches to the horizon.','Sinop is the northernmost city in Türkiye, a natural harbour enclosed by a headland that juts into the Black Sea. The Fortress Inn occupies rooms carved directly into the Byzantine sea walls, their thick stone keeping the interior cool even on August afternoons. Outside, the Black Sea stretches to an unbroken horizon. The town itself is one of the least-visited and most well-preserved historic settlements on the northern coast — quiet, unhurried, and genuinely local.','Heritage','Fortress','mansion','Sinop','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80','14:00','11:00',ARRAY['English','Turkish'],5,1,1,false,false,true,true,true,false,false,true,true,9)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM hotels WHERE slug='sinop-fortress-inn';
  INSERT INTO hotel_amenities (hotel_id,text,is_property,sort_order) VALUES
    (v_id,'Byzantine Architecture',false,0),(v_id,'Sea Views',false,1),(v_id,'Stone-Walled Rooms',false,2),(v_id,'Harbour Access',false,3),(v_id,'Historic Town',false,4)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_images (hotel_id,url,label,sort_order) VALUES
    (v_id,'https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?w=1200&q=80','Exterior',0),
    (v_id,'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80','Bedroom',1),
    (v_id,'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80','Bathroom',2),
    (v_id,'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80','View',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_room_types (hotel_id,name,capacity,beds,size,image_index,highlights,sort_order) VALUES
    (v_id,'Fortress Room',2,'1 double bed','22 m²',1,ARRAY['Byzantine stone walls','Sea views','Breakfast included'],0),
    (v_id,'Sea Wall Suite',2,'1 king bed','38 m²',3,ARRAY['Panoramic Black Sea','Historic fortress access','Balcony'],1)
  ON CONFLICT DO NOTHING;
END $$;

-- Eastern Anatolia: Lake Van Konak
INSERT INTO hotels (slug,name,region,description,long_description,tag_a,tag_b,svg_variant,location,bedroom_image,check_in_time,check_out_time,languages,distance_km,bedrooms,bathrooms,free_wifi,free_cancellation,free_parking,bed_breakfast,balcony,washer,ac,tv,is_published,sort_order)
VALUES ('lake-van-konak','Lake Van Konak','Eastern Anatolia','A beautifully restored Armenian mansion on the shores of the world''s largest soda lake, with views across the water to the island church of Akdamar.','Lake Van is the largest lake in Türkiye and one of the largest soda lakes in the world — its waters a striking shade of turquoise-blue, too alkaline for most fish but home to the endemic pearl mullet. The konak, a restored Armenian mansion built in 1904, sits directly on the southern shore. From the waterfront terrace, the island church of Akdamar is visible on clear days, its 10th-century khachkars still sharp against the sky after eleven centuries.','Lakeside','Heritage','mansion','Van, Eastern Anatolia','https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80','15:00','12:00',ARRAY['English','Turkish','Kurdish'],11,2,2,true,true,true,false,true,true,true,true,true,10)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM hotels WHERE slug='lake-van-konak';
  INSERT INTO hotel_amenities (hotel_id,text,is_property,sort_order) VALUES
    (v_id,'Lake Terrace',false,0),(v_id,'Boat to Akdamar',false,1),(v_id,'Armenian Architecture',false,2),(v_id,'Sunrise Views',false,3),(v_id,'Regional Cuisine',false,4)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_images (hotel_id,url,label,sort_order) VALUES
    (v_id,'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80','Exterior',0),
    (v_id,'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80','Bedroom',1),
    (v_id,'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1200&q=80','Bathroom',2),
    (v_id,'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=1200&q=80','View',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_room_types (hotel_id,name,capacity,beds,size,image_index,highlights,sort_order) VALUES
    (v_id,'Lakeside Room',2,'1 king bed','36 m²',1,ARRAY['Lake Van views','Boat to Akdamar','Armenian architecture'],0),
    (v_id,'Family Suite',4,'2 double beds','60 m²',0,ARRAY['Two bedrooms','Sunrise lake views','Regional cuisine'],1)
  ON CONFLICT DO NOTHING;
END $$;

-- Eastern Anatolia: Mardin Taş Konağı
INSERT INTO hotels (slug,name,region,description,long_description,tag_a,tag_b,svg_variant,location,bedroom_image,check_in_time,check_out_time,languages,distance_km,bedrooms,bathrooms,free_wifi,free_cancellation,free_parking,bed_breakfast,balcony,washer,ac,tv,is_published,sort_order)
VALUES ('mardin-tas-konagi','Mardin Taş Konağı','Eastern Anatolia','A hand-carved limestone konağ perched in the old city of Mardin, with a roof terrace overlooking the golden Mesopotamian plain at sunset.','Mardin is carved from honey-coloured limestone on a ridge above the Mesopotamian plain — one of the most visually arresting old cities in the Middle East. The Taş Konağı occupies a 19th-century mansion whose every surface is hand-carved with geometric and floral motifs by local Syriac craftsmen. The roof terrace, open from sundown, looks out over a plain that stretches flat and golden to the Syrian border, the last light catching the distant tells of ancient settlements.','Boutique','Rooftop','ottoman','Mardin, Eastern Anatolia','https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80','15:00','12:00',ARRAY['English','Turkish','Arabic','Syriac'],8,1,1,true,false,false,true,true,true,true,false,true,11)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM hotels WHERE slug='mardin-tas-konagi';
  INSERT INTO hotel_amenities (hotel_id,text,is_property,sort_order) VALUES
    (v_id,'Rooftop Terrace',false,0),(v_id,'Hand-Carved Stone',false,1),(v_id,'Mesopotamian Views',false,2),(v_id,'Old City Location',false,3),(v_id,'Syriac Heritage',false,4)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_images (hotel_id,url,label,sort_order) VALUES
    (v_id,'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80','Exterior',0),
    (v_id,'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80','Bedroom',1),
    (v_id,'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80','Bathroom',2),
    (v_id,'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80','View',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO hotel_room_types (hotel_id,name,capacity,beds,size,image_index,highlights,sort_order) VALUES
    (v_id,'Stone Room',2,'1 double bed','24 m²',1,ARRAY['Hand-carved stone décor','Old city location','Breakfast included'],0),
    (v_id,'Rooftop Suite',2,'1 king bed','40 m²',3,ARRAY['Private rooftop terrace','Mesopotamian plain views','Syriac heritage'],1)
  ON CONFLICT DO NOTHING;
END $$;


-- -------------------------------------------------------------
-- PREMADE PACKAGES (seed from static data)
-- -------------------------------------------------------------

INSERT INTO premade_packages (slug,name,start_date,end_date,destinations,hero_image,card_image,short_description,accommodation_name,accommodation_description,accommodation_image_a,accommodation_image_b,vehicle_model,vehicle_features,is_published,sort_order)
VALUES
('istanbul-cappadocia-7','Istanbul & Cappadocia','2025-07-10','2025-07-16',ARRAY['Istanbul','Göreme','Uçhisar'],
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
 'Seven days through Ottoman grandeur and volcanic dreamscapes — Bosphorus, spice markets, balloon flight at dawn.',
 'Göreme Cave Lodge','Carved from volcanic tuff, opening onto the Rose Valley.',
 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80',
 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
 'Mercedes Vito',ARRAY['Private driver','Wi-Fi on board','Climate control'],
 true,0)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO premade_packages (slug,name,start_date,end_date,destinations,hero_image,card_image,short_description,accommodation_name,accommodation_description,accommodation_image_a,accommodation_image_b,vehicle_model,vehicle_features,is_published,sort_order)
VALUES
('aegean-coast-5','Aegean Coast','2025-08-01','2025-08-05',ARRAY['İzmir','Alaçatı','Bodrum'],
 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=80',
 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80',
 'Five days along the turquoise coast — windmill villages, ancient ruins, and whitewashed harbour towns.',
 'Alaçatı Stone House','A 19th-century Greek stone house in the famous windmill village.',
 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80',
 'Mercedes Sprinter',ARRAY['Private driver','Luggage storage','USB charging'],
 true,1)
ON CONFLICT (slug) DO NOTHING;


-- -------------------------------------------------------------
-- DAILY PACKAGES (seed from static data)
-- -------------------------------------------------------------

INSERT INTO daily_packages (slug,name,tour_date,start_time,end_time,hero_image,card_image,vehicle,driver,price,currency,short_description,region,is_published,sort_order)
VALUES
('golden-horn-sunset','Golden Horn Sunset Cruise','2025-06-15','17:00','21:00',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80',
 'Private gulet','Mehmet',180,'USD',
 'A private gulet cruise through the Golden Horn as the sun sets behind the minarets.',
 'Istanbul',true,0)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM daily_packages WHERE slug='golden-horn-sunset';
  INSERT INTO daily_package_stops (package_id,stop_time,place,description,sort_order) VALUES
    (v_id,'17:00','Eminönü Pier','Board the private gulet at the historic waterfront pier.',0),
    (v_id,'17:30','Golden Horn','Cruise up the inlet as the afternoon light turns amber.',1),
    (v_id,'19:00','Bosphorus Straits','Cross into the Bosphorus as the city lights begin to glow.',2),
    (v_id,'20:30','Galata Bridge','Return under the bridge as dinner is served on deck.',3)
  ON CONFLICT DO NOTHING;
  INSERT INTO daily_package_included (package_id,text,sort_order) VALUES
    (v_id,'Private gulet with captain',0),(v_id,'Welcome drinks and mezze',1),(v_id,'Sunset dinner on board',2),(v_id,'Hotel pickup and drop-off',3)
  ON CONFLICT DO NOTHING;
END $$;

INSERT INTO daily_packages (slug,name,tour_date,start_time,end_time,hero_image,card_image,vehicle,driver,price,currency,short_description,region,is_published,sort_order)
VALUES
('cappadocia-valleys-hike','Cappadocia Valleys Hike','2025-07-20','07:00','17:00',
 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80',
 'Land Rover Defender','Ayla',220,'USD',
 'A full day hiking the Rose, Red, and Pigeon Valleys with a private guide and 4WD access.',
 'Cappadocia',true,1)
ON CONFLICT (slug) DO NOTHING;

DO $$ DECLARE v_id uuid; BEGIN
  SELECT id INTO v_id FROM daily_packages WHERE slug='cappadocia-valleys-hike';
  INSERT INTO daily_package_stops (package_id,stop_time,place,description,sort_order) VALUES
    (v_id,'07:00','Hotel pickup','Land Rover pickup from your hotel in Göreme.',0),
    (v_id,'08:00','Rose Valley trailhead','Begin the hike through rose-coloured rock formations.',1),
    (v_id,'11:00','Red Valley lookout','Rest at the panoramic viewpoint above the valley.',2),
    (v_id,'13:00','Village lunch stop','Traditional gözleme lunch at a local farm.',3),
    (v_id,'14:30','Pigeon Valley','Walk the pigeon-house cliffs as afternoon light softens.',4),
    (v_id,'16:30','Return drive','4WD return through the plateau to your hotel.',5)
  ON CONFLICT DO NOTHING;
  INSERT INTO daily_package_included (package_id,text,sort_order) VALUES
    (v_id,'Private Land Rover Defender',0),(v_id,'Licensed English-speaking guide',1),(v_id,'Traditional lunch',2),(v_id,'Entrance fees',3),(v_id,'Hotel pickup and drop-off',4)
  ON CONFLICT DO NOTHING;
END $$;
