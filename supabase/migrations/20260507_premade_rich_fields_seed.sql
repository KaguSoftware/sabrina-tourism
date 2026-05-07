-- Seed rich fields for the 3 existing premade packages
-- Matches data previously in src/lib/premade-packages/data.ts

-- ─────────────────────────────────────────────
-- 1. Istanbul & Cappadocia Classic
-- ─────────────────────────────────────────────
DO $$
DECLARE pkg_id uuid;
BEGIN
  SELECT id INTO pkg_id FROM premade_packages WHERE slug = 'istanbul-cappadocia-classic';
  IF pkg_id IS NULL THEN RETURN; END IF;

  UPDATE premade_packages SET
    region         = 'Istanbul & Cappadocia',
    duration       = '7 days / 6 nights',
    min_people     = 1,
    max_people     = 8,
    available_from = '2025-04-01',
    available_to   = '2025-11-30',
    overview       = 'Istanbul and Cappadocia sit at opposite ends of Turkey''s soul — one all marble and minarets above the water, the other carved from volcanic ash below open sky. This route connects them without compromise.' || E'\n' ||
                     'Three days in the city cover the Sultanahmet essentials, the Bosphorus at dusk, and a market lunch that stretches into the afternoon. Then a short flight takes you to Göreme, where mornings begin before sunrise and the valleys are yours before the crowds arrive.'
  WHERE id = pkg_id;

  -- Itinerary
  INSERT INTO premade_package_itinerary_days (package_id, day_number, title, description, sort_order) VALUES
    (pkg_id, 1, 'Arrival in Istanbul', 'Private transfer from the airport to your hotel in Sultanahmet. Settle in, then a short walk to catch the Bosphorus at dusk — the city looks best from the water''s edge at golden hour.', 0),
    (pkg_id, 2, 'The Old City', 'Morning at the Blue Mosque and Hagia Sophia before the heat peaks. Lunch at a meyhane in Karaköy. Afternoon at the Grand Bazaar — your guide knows which lanes to skip.', 1),
    (pkg_id, 3, 'Bosphorus & Beyoğlu', 'A private boat along the Bosphorus, past the Dolmabahçe Palace facade and the first bridge. Afternoon in Beyoğlu for coffee and contemporary art. Rooftop dinner with a city view.', 2),
    (pkg_id, 4, 'Flight to Cappadocia', 'Morning flight to Kayseri or Nevşehir. Private transfer into the valleys — first stop the Devrent panorama. Check into your cave suite before the light fades from the cliffs.', 3),
    (pkg_id, 5, 'Balloons at first light', 'Pre-dawn pickup, a short briefing, then an hour aloft over the fairy chimneys as the sun cracks the horizon. Landing with champagne in the open field, then back to the hotel for breakfast.', 4),
    (pkg_id, 6, 'Valleys & underground cities', 'A full day on foot through the Rose and Red Valleys, down into Derinkuyu''s underground city, and through the pottery workshops of Avanos. Dinner in a stone-carved cellar restaurant.', 5),
    (pkg_id, 7, 'Departure', 'Slow morning, final coffee on your terrace. Private transfer to the airport for your onward flight.', 6);

  -- Tiers
  INSERT INTO premade_package_tiers (package_id, tier_name, vehicle_class, accommodation, group_size, guide_languages, meals_included, highlights, sort_order) VALUES
    (pkg_id, 'Essential', 'Premium sedan or shared van', '3★ boutique', 'Small group up to 8', ARRAY['English'], 'Daily breakfast', ARRAY['Shared transfers between airports & hotels', 'Group guided city walk in Istanbul', 'Cave hotel in Göreme, 3★ category'], 0),
    (pkg_id, 'Signature', 'Mercedes V-Class with private driver', '4★ design hotels', 'Private — up to 6', ARRAY['English', 'French'], 'Breakfast + 3 curated dinners', ARRAY['Smaller balloon basket (8 guests)', 'Private guide & vehicle throughout', 'Restored boutique cave suite'], 1),
    (pkg_id, 'Private', 'Mercedes S-Class with chauffeur', '5★ heritage & cave suites', 'Strictly private — your party only', ARRAY['English', 'French', 'Arabic', 'German'], 'Breakfast + all dinners, hosted', ARRAY['Private balloon for your party only', 'Private chef dinner in a cave cellar', '5★ heritage cave suite with private terrace'], 2);

  -- Inclusions
  INSERT INTO premade_package_inclusions (package_id, kind, text, sort_order) VALUES
    (pkg_id, 'included', 'All private transfers (airport, hotel, inter-city)', 0),
    (pkg_id, 'included', 'Domestic flight Istanbul → Cappadocia', 1),
    (pkg_id, 'included', 'Hot-air balloon flight with champagne', 2),
    (pkg_id, 'included', '6 nights accommodation (3 Istanbul + 3 Cappadocia)', 3),
    (pkg_id, 'included', 'Private English-speaking guide throughout', 4),
    (pkg_id, 'included', 'Meals as listed per tier', 5),
    (pkg_id, 'not_included', 'International flights', 0),
    (pkg_id, 'not_included', 'Travel insurance', 1),
    (pkg_id, 'not_included', 'Personal expenses & tips', 2),
    (pkg_id, 'not_included', 'Optional activities not in itinerary', 3);
END $$;

-- ─────────────────────────────────────────────
-- 2. Aegean Coast Escape
-- ─────────────────────────────────────────────
DO $$
DECLARE pkg_id uuid;
BEGIN
  SELECT id INTO pkg_id FROM premade_packages WHERE slug = 'aegean-coast-escape';
  IF pkg_id IS NULL THEN RETURN; END IF;

  UPDATE premade_packages SET
    region         = 'Aegean',
    duration       = '8 days / 7 nights',
    min_people     = 1,
    max_people     = 6,
    available_from = '2025-05-01',
    available_to   = '2025-10-31',
    overview       = 'The Aegean coast is three things at once — an archaeological record, a sailing destination, and a place where lunch can last until four. This route takes all three seriously.' || E'\n' ||
                     'Ephesus in the early morning before the tour buses arrive. The cotton terraces of Pamukkale at midday when the light turns everything white. Bodrum in the evening, when the castle glows amber and the waterfront fills with the smell of grilled sea bass.'
  WHERE id = pkg_id;

  INSERT INTO premade_package_itinerary_days (package_id, day_number, title, description, sort_order) VALUES
    (pkg_id, 1, 'Arrival in İzmir', 'Transfer from İzmir Adnan Menderes Airport to your hotel in the city. Evening walk along the Kordon waterfront. Dinner at a fish restaurant with Aegean wine.', 0),
    (pkg_id, 2, 'Ephesus — the ancient city', 'Early morning departure to beat the heat and the crowds. Your guide navigates the Library of Celsus, the Great Theatre, and the marble streets at a pace that lets it sink in. Lunch in Selçuk.', 1),
    (pkg_id, 3, 'Pamukkale & the travertines', 'Drive inland to Pamukkale. The travertine terraces are best seen before noon — white as salt flats, warm as bathwater. Visit the Hierapolis ruins above. Back to the coast by evening.', 2),
    (pkg_id, 4, 'Drive to Bodrum', 'Coastal road south with a stop at the Temple of Apollo at Didyma. Check into your Bodrum hotel by late afternoon. Sunset from the castle walls, dinner on the waterfront.', 3),
    (pkg_id, 5, 'Bodrum Bay by water', 'A full day on the Aegean — a gulet charter through the bay, swimming stops in clear coves, lunch on deck. Back to Bodrum harbour by late afternoon.', 4),
    (pkg_id, 6, 'Bodrum town & the castle', 'Morning at the Museum of Underwater Archaeology inside Bodrum Castle. Afternoon free for the market and the old quarter. Farewell dinner at a rooftop restaurant.', 5),
    (pkg_id, 7, 'Leisurely departure', 'Late breakfast, final swim if time allows. Transfer to Bodrum Milas Airport or İzmir for your return flight.', 6),
    (pkg_id, 8, 'Departure', 'Final transfers and departure as per your flight schedule.', 7);

  INSERT INTO premade_package_tiers (package_id, tier_name, vehicle_class, accommodation, group_size, guide_languages, meals_included, highlights, sort_order) VALUES
    (pkg_id, 'Essential', 'Air-conditioned minivan (shared)', '3★ seafront hotels', 'Small group up to 8', ARRAY['English'], 'Daily breakfast', ARRAY['Shared guiding at Ephesus & Pamukkale', 'Bodrum harbour walk with local guide', '3★ seafront hotel in Bodrum'], 0),
    (pkg_id, 'Signature', 'Toyota Land Cruiser with private driver', '4★ boutique hotels', 'Private — up to 5', ARRAY['English', 'French'], 'Breakfast + 3 dinners', ARRAY['Private Ephesus tour with archaeologist guide', 'Sunset gulet cruise in Bodrum Bay', '4★ boutique rooms with Aegean views'], 1),
    (pkg_id, 'Private', 'Mercedes Sprinter with chauffeur', '5★ design retreats', 'Strictly private — your party only', ARRAY['English', 'French', 'Arabic', 'German'], 'All meals hosted', ARRAY['Exclusive access to restricted Ephesus sections', 'Private overnight gulet charter', '5★ cliff villa with infinity pool'], 2);

  INSERT INTO premade_package_inclusions (package_id, kind, text, sort_order) VALUES
    (pkg_id, 'included', 'All private transfers throughout', 0),
    (pkg_id, 'included', '7 nights accommodation', 1),
    (pkg_id, 'included', 'Gulet cruise (Bodrum Bay)', 2),
    (pkg_id, 'included', 'Private guide at all archaeological sites', 3),
    (pkg_id, 'included', 'Entry fees to Ephesus, Pamukkale, Bodrum Castle', 4),
    (pkg_id, 'included', 'Meals as listed per tier', 5),
    (pkg_id, 'not_included', 'International & domestic flights', 0),
    (pkg_id, 'not_included', 'Travel insurance', 1),
    (pkg_id, 'not_included', 'Personal expenses & tips', 2),
    (pkg_id, 'not_included', 'Optional water sports', 3);
END $$;

-- ─────────────────────────────────────────────
-- 3. Eastern Anatolia Discovery
-- ─────────────────────────────────────────────
DO $$
DECLARE pkg_id uuid;
BEGIN
  SELECT id INTO pkg_id FROM premade_packages WHERE slug = 'eastern-anatolia-discovery';
  IF pkg_id IS NULL THEN RETURN; END IF;

  UPDATE premade_packages SET
    region         = 'Eastern Anatolia',
    duration       = '9 days / 8 nights',
    min_people     = 2,
    max_people     = 10,
    available_from = '2025-06-01',
    available_to   = '2025-10-15',
    overview       = 'Eastern Anatolia is what the rest of Turkey used to be before the tourists arrived. The landscapes are enormous — Lake Van at 1,650 metres, Ararat white-capped on the horizon, the Kaçkar mountains dropping straight into the Black Sea.' || E'\n' ||
                     'This route moves deliberately. No more than one significant site per day. Long lunches in towns where the menu isn''t translated. Sunsets from castle walls with no one else there.'
  WHERE id = pkg_id;

  INSERT INTO premade_package_itinerary_days (package_id, day_number, title, description, sort_order) VALUES
    (pkg_id, 1, 'Arrival in Trabzon', 'Fly into Trabzon on the Black Sea coast. Transfer to your hotel. Evening walk through the old bazaar, tea in a traditional çay bahçesi, dinner overlooking the water.', 0),
    (pkg_id, 2, 'Sumela Monastery & the plateau', 'Morning at the cliff-carved Sumela Monastery, built into the rock face above a forested gorge. Afternoon drive up to the Zigana plateau — green, cold, and largely empty.', 1),
    (pkg_id, 3, 'Drive to Erzurum', 'Cross the mountains on the old trade road. Stop at the Çifte Minareli Medrese in Erzurum — one of the finest Seljuk buildings standing. The city has a particular darkness to its stone that you don''t find on the coast.', 2),
    (pkg_id, 4, 'Erzurum & the eastern highlands', 'Full day to explore Erzurum''s citadel and the Three Tombs. Afternoon drive to the Palandöken ski plateau for views back across the city. Long dinner at a lokanta serving eastern specialities.', 3),
    (pkg_id, 5, 'Drive south to Van', 'Long drive south through volcanic landscape — the road passes Ağrı (closest view of Ararat), then drops down to the immense blue of Lake Van. Check in and rest.', 4),
    (pkg_id, 6, 'Akdamar Island & Van Castle', 'Morning boat to Akdamar Island to visit the 10th-century Church of the Holy Cross — its bas-reliefs of biblical scenes are extraordinary. Afternoon at Van Castle on the lake shore.', 5),
    (pkg_id, 7, 'Doğubayazıt & İshak Paşa', 'Drive to Doğubayazıt, gateway to Ararat. The İshak Paşa Sarayı palace sits impossibly carved from the hillside, with Ararat filling the sky behind it. Best light is late afternoon.', 6),
    (pkg_id, 8, 'Final morning & return', 'Early morning view of Ararat before cloud. Transfer to Van Airport for the return flight. End of a route that most people only read about.', 7),
    (pkg_id, 9, 'Departure', 'Final transfers and departure as per your flight schedule.', 8);

  INSERT INTO premade_package_tiers (package_id, tier_name, vehicle_class, accommodation, group_size, guide_languages, meals_included, highlights, sort_order) VALUES
    (pkg_id, 'Essential', 'Mercedes Sprinter (shared)', '3★ local hotels', 'Small group up to 10', ARRAY['English'], 'Daily breakfast', ARRAY['Group convoy with local guide', 'Visit to Akdamar Island church', 'Sumela Monastery & Trabzon highlights'], 0),
    (pkg_id, 'Signature', 'Toyota Land Cruiser with private driver', '4★ boutique & lodge stays', 'Private — up to 6', ARRAY['English', 'Turkish'], 'Breakfast + 4 dinners', ARRAY['Private boat to Akdamar Island', 'Off-road day to Kaçkar mountain foothills', 'Dinner with a local Kurdish family'], 1),
    (pkg_id, 'Private', '4×4 convoy with lead guide vehicle', '5★ lodges & heritage guesthouses', 'Strictly private — your party only', ARRAY['English', 'Turkish', 'Arabic', 'Kurdish'], 'All meals hosted', ARRAY['Helicopter transfer over Ararat (weather permitting)', 'Exclusive access to restricted archaeological sites', 'Private ethnographic briefing each evening'], 2);

  INSERT INTO premade_package_inclusions (package_id, kind, text, sort_order) VALUES
    (pkg_id, 'included', 'All ground transfers by private vehicle', 0),
    (pkg_id, 'included', '8 nights accommodation', 1),
    (pkg_id, 'included', 'Boat to Akdamar Island', 2),
    (pkg_id, 'included', 'Private guide for all days', 3),
    (pkg_id, 'included', 'Entry fees to all monuments & sites', 4),
    (pkg_id, 'included', 'Meals as listed per tier', 5),
    (pkg_id, 'not_included', 'Domestic flights (Trabzon in / Van out)', 0),
    (pkg_id, 'not_included', 'International flights', 1),
    (pkg_id, 'not_included', 'Travel insurance', 2),
    (pkg_id, 'not_included', 'Personal expenses & tips', 3);
END $$;
