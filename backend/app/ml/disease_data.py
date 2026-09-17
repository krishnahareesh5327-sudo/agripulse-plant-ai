"""
AgriPulse AI - Plant Pathology Knowledge Base
Standardized botanical and agronomic taxonomy based on PlantVillage benchmarks.
"""
from typing import Dict, Any

DISEASE_REGISTRY: Dict[str, Dict[str, Any]] = {
    # TOMATO
    "tomato_early_blight": {
        "crop": "Tomato",
        "condition": "Early Blight",
        "scientific_name": "Alternaria solani",
        "pathogen_type": "Fungus",
        "is_healthy": False,
        "default_severity": "Moderate",
        "risk_level": "Moderate to High",
        "description": "A prevalent fungal disease attacking tomato foliage, stems, and fruit. Produces distinctive concentric dark brown rings surrounded by chlorotic yellow halos.",
        "symptoms": [
            "Concentric dark brown to black circular lesions ('target board' pattern)",
            "Yellow halo (chlorosis) encircling individual lesions",
            "Lower and older leaves affected first, progressing upward",
            "Premature defoliation exposing fruit to sunscald"
        ],
        "causes": "Alternaria solani survives in infected crop debris, solanaceous weeds, and seed. Favored by warm temperatures (24-29°C) combined with intermittent wet weather and high humidity.",
        "favored_environment": {
            "temp_range": "24°C - 30°C",
            "humidity": "> 80%",
            "soil_moisture": "Excessive wetness or splashing water",
            "key_vector": "Rain splash, overhead sprinkler irrigation, contaminated pruning tools"
        },
        "immediate_actions": [
            "Prune and safely discard all infected lower foliage displaying target spots immediately.",
            "Sterilize shears with 70% isopropyl alcohol between plants to stop spore transfer.",
            "Switch strictly to drip irrigation or ground soaker hoses; avoid overhead spraying."
        ],
        "crop_management": [
            "Apply a 2-3 inch organic mulch layer (straw, bark) under vines to prevent soil-borne spore splash.",
            "Increase plant spacing to at least 60 cm to improve air velocity through the canopy.",
            "Enforce a 3-year crop rotation schedule away from solanaceous plants (potato, eggplant, pepper)."
        ],
        "treatments": {
            "organic": [
                "Apply preventative Copper octanoate or Copper sulfate sprays at early lesion emergence.",
                "Utilize Bacillus subtilis bio-fungicide formulations as preventive soil and canopy drench."
            ],
            "chemical": [
                "Use preventative chlorothalonil, mancozeb, or azoxystrobin where certified and registered.",
                "Rotate fungicide FRAC groups (e.g., FRAC 11 and FRAC M05) to prevent resistance development."
            ],
            "safety_disclaimer": "Use only crop protection products legally approved for tomatoes in your specific territory. Always adhere strictly to the Pre-Harvest Interval (PHI) and Personal Protective Equipment (PPE) instructions on the manufacturer label."
        },
        "prevention": [
            "Plant certified disease-free transplants or resistant/tolerant cultivars (e.g., 'Mountain Fresh Plus').",
            "Deep-till or completely remove tomato vines and root balls post-harvest.",
            "Provide adequate staking and trellis support to keep foliage elevated off soil."
        ],
        "monitoring_checklist": [
            "Inspect lower leaf surfaces every 48 hours following rainy or humid periods.",
            "Check stem junctions for dark sunken cankers.",
            "Monitor canopy humidity levels and record morning leaf wetness duration."
        ]
    },
    "tomato_late_blight": {
        "crop": "Tomato",
        "condition": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "pathogen_type": "Oomycete / Water Mold",
        "is_healthy": False,
        "default_severity": "Critical",
        "risk_level": "Critical",
        "description": "An aggressive, fast-moving oomycete pathogen capable of destroying entire tomato crops in days under cool, humid conditions. Notable historically as the cause of the Irish potato famine.",
        "symptoms": [
            "Irregular water-soaked pale green or purplish-black lesions on leaves and stems",
            "Cottony white fungal-like sporulation visible on the underside of leaves in humid mornings",
            "Rapid collapse and browning of entire leaf branches",
            "Firm brown leathery rot on developing green and ripe tomato fruit"
        ],
        "causes": "Phytophthora infestans produces windblown and rain-splashed sporangia. It thrives in cool, persistently damp weather (15-22°C) with relative humidity exceeding 90%.",
        "favored_environment": {
            "temp_range": "15°C - 22°C",
            "humidity": "> 85%",
            "soil_moisture": "Saturated or waterlogged soils",
            "key_vector": "Windblown sporangia, infected cull piles, volunteer plants"
        },
        "immediate_actions": [
            "Isolate the infected block immediately and cease all field operations when foliage is wet.",
            "Bag infected plants in plastic before uprooting to trap windblown sporangia.",
            "Do not compost infected foliage; burn or landfill deep underground."
        ],
        "crop_management": [
            "Avoid planting downwind of potato fields or unmanaged solanaceous plots.",
            "Maximize sun exposure and ensure rows are oriented with prevailing winds to dry leaves quickly.",
            "Eradicate volunteer tomato and potato seedlings nearby that serve as disease reservoirs."
        ],
        "treatments": {
            "organic": [
                "Apply fixed copper fungicides before rainy periods as a preventative protective barrier."
            ],
            "chemical": [
                "Apply systemic oomycete-targeted compounds (e.g., cymoxanil, dimethomorph, or mandipropamid) immediately upon local regional late blight warnings.",
                "Ensure thorough coverage of both upper and lower leaf surfaces."
            ],
            "safety_disclaimer": "Late blight requires rapid regional intervention. Consult local agricultural university extension alerts and apply only licensed fungicides."
        },
        "prevention": [
            "Plant resistant tomato cultivars (such as 'Defiant PhR', 'Mountain Merit', 'Iron Lady').",
            "Ensure seed tubers and transplants are certified pathogen-free.",
            "Implement automated weather alerts tracking continuous hours of leaf wetness."
        ],
        "monitoring_checklist": [
            "Conduct daily scouting when nighttime temperatures are 10-15°C and daytime 18-24°C with fog or rain.",
            "Check shaded interior foliage for subtle water-soaked spots.",
            "Review regional blight tracking networks (e.g., USAblight or EuroBlight)."
        ]
    },
    "tomato_bacterial_spot": {
        "crop": "Tomato",
        "condition": "Bacterial Spot",
        "scientific_name": "Xanthomonas vesicatoria",
        "pathogen_type": "Bacterium",
        "is_healthy": False,
        "default_severity": "Moderate",
        "risk_level": "Moderate",
        "description": "A destructive bacterial disease causing small, dark, scabby lesions on leaves, stems, and fruit. Particularly devastating in warm, rainy agricultural zones.",
        "symptoms": [
            "Small (less than 3mm), dark brown to black water-soaked circular spots",
            "Spots appear greasy and often have a thin yellowish border",
            "Lesions merge causing tearing or shot-hole appearance as leaf centers dry out",
            "Blister-like, scabby raised spots on tomato fruit with brown margins"
        ],
        "causes": "Xanthomonas species enter through natural leaf openings (stomata) and mechanical wounds. Spread by splashing rain, worker traffic, and contaminated seed lots.",
        "favored_environment": {
            "temp_range": "24°C - 32°C",
            "humidity": "> 85%",
            "soil_moisture": "Moderate to High",
            "key_vector": "Rain splash, high-pressure sprayers, handling wet plants"
        },
        "immediate_actions": [
            "Halt all human pruning and harvesting while foliage is wet to avoid bacterial spreading.",
            "Rogue out severely stunted seedlings and dispose of in sealed bags.",
            "Disinfect hand tools and stakes with 10% sodium hypochlorite or quaternary ammonium."
        ],
        "crop_management": [
            "Avoid overhead irrigation completely.",
            "Ensure generous row spacing (minimum 75 cm) for rapid morning drying.",
            "Rotate fields out of Solanaceae for a minimum of two full seasons."
        ],
        "treatments": {
            "organic": [
                "Apply Copper hydroxide combined with Bacillus amyloliquefaciens or Serenade ASO.",
                "Utilize bactericidal bio-protectants during vegetative growth stages."
            ],
            "chemical": [
                "Apply fixed copper mixed with mancozeb (which enhances copper bactericidal activity against tolerant strains).",
                "Apply acibenzolar-S-methyl (Actigard) to stimulate systemic acquired resistance."
            ],
            "safety_disclaimer": "Bacterial spot can exhibit copper resistance in many regions. Verify local resistance profiles with your agricultural extension officer."
        },
        "prevention": [
            "Use only hot-water treated or certified disease-free seed.",
            "Select resistant cultivars if available for your race variant.",
            "Incorporate crop residues deeply immediately following the harvest season."
        ],
        "monitoring_checklist": [
            "Inspect newly emerged leaves after severe wind-driven rain events.",
            "Check nursery transplants closely before transferring into open field beds."
        ]
    },
    "tomato_healthy": {
        "crop": "Tomato",
        "condition": "Healthy Plant",
        "scientific_name": "Solanum lycopersicum",
        "pathogen_type": "None (Healthy)",
        "is_healthy": True,
        "default_severity": "None",
        "risk_level": "Low",
        "description": "The tomato foliage displays vibrant chlorophyll pigmentation, robust turgor pressure, uniform leaf margins, and absence of pathogenic spotting or necrosis.",
        "symptoms": [
            "Deep green, uniform foliage with natural serrated leaf margins",
            "Smooth stem tissue with healthy trichome (hair) coverage",
            "No necrotic lesions, halos, powdery residue, or chlorosis",
            "Strong vegetative vigor and normal apical growth"
        ],
        "causes": "Balanced nutrition, optimal environmental conditions, and diligent preventative crop hygiene.",
        "favored_environment": {
            "temp_range": "20°C - 28°C",
            "humidity": "50% - 70%",
            "soil_moisture": "60% - 75%",
            "key_vector": "None"
        },
        "immediate_actions": [
            "Maintain current irrigation and fertigation schedule.",
            "Ensure regular trellising, suckering, and lower leaf pruning as vines expand."
        ],
        "crop_management": [
            "Maintain balanced N-P-K nutrient application with adequate Calcium to prevent blossom end rot.",
            "Keep soil mulch intact to moderate root-zone temperature and preserve moisture.",
            "Ensure active ventilation in greenhouse/tunnel setups."
        ],
        "treatments": {
            "organic": ["Routine preventative organic compost tea or mycorrhizal soil application."],
            "chemical": ["No chemical treatment needed for healthy crops."],
            "safety_disclaimer": "Avoid prophylactic pesticide application when plants are healthy to protect beneficial pollinators and predatory insects."
        },
        "prevention": [
            "Continue regular weekly scouting protocol.",
            "Maintain consistent drip watering schedule to avoid moisture fluctuations.",
            "Record environmental sensor logs to maintain target microclimate."
        ],
        "monitoring_checklist": [
            "Inspect weekly for early aphid or whitefly presence on leaf undersides.",
            "Check soil moisture meters regularly to prevent drought or waterlogging."
        ]
    },

    # POTATO
    "potato_early_blight": {
        "crop": "Potato",
        "condition": "Early Blight",
        "scientific_name": "Alternaria solani",
        "pathogen_type": "Fungus",
        "is_healthy": False,
        "default_severity": "Moderate",
        "risk_level": "Moderate",
        "description": "Fungal leaf spot disease affecting potato canopies. Causes brown angular spots bordered by leaf veins, leading to senescent yellow foliage and reduced tuber yield.",
        "symptoms": [
            "Dark brown to black angular necrotic spots on older leaves",
            "Concentric concentric ridges visible within mature lesions",
            "Yellowing foliage around lesions causing early leaf drop",
            "Brown, sunken, corky lesions on harvested tubers"
        ],
        "causes": "Overwinters in infested crop residues and infected seed tubers. Thrives under alternating cycles of wet weather and warm dry spells.",
        "favored_environment": {
            "temp_range": "24°C - 30°C",
            "humidity": "> 75%",
            "soil_moisture": "Variable moisture with intermittent foliage wetting",
            "key_vector": "Rain splash, wind, machinery"
        },
        "immediate_actions": [
            "Remove diseased lower foliage where practical in smaller plots.",
            "Discontinue overhead irrigation and shift to furrows or drip tape.",
            "Adjust nitrogen fertility to prevent crop stress and premature senescence."
        ],
        "crop_management": [
            "Rotate out of potatoes and solanaceous crops for a minimum of 2-3 years.",
            "Ensure balanced fertilization; nitrogen-deficient plants are significantly more susceptible.",
            "Allow tubers to fully mature and skins to set before harvesting."
        ],
        "treatments": {
            "organic": ["Copper sulfate or copper hydroxide preventative applications."],
            "chemical": ["Chlorothalonil, azoxystrobin, or difenoconazole according to regional crop guidelines."],
            "safety_disclaimer": "Follow agricultural pesticide usage regulations and observe pre-harvest intervals."
        },
        "prevention": [
            "Plant only certified disease-free seed tubers.",
            "Choose potato cultivars with moderate foliar resistance (e.g., 'Kennebec', 'Russet Burbank').",
            "Hill potatoes adequately to protect tubers from fungal spores washing down through soil."
        ],
        "monitoring_checklist": [
            "Begin intensive scouting around row closure.",
            "Check lower canopy leaves twice weekly."
        ]
    },
    "potato_late_blight": {
        "crop": "Potato",
        "condition": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "pathogen_type": "Oomycete / Water Mold",
        "is_healthy": False,
        "default_severity": "Critical",
        "risk_level": "Critical",
        "description": "Extremely devastating disease of potato canopies and tubers. Can cause total defoliation in under two weeks if weather remains cool and wet.",
        "symptoms": [
            "Dark, water-soaked expanding spots that turn purplish-black",
            "White velvety sporulation on the underside of leaves during morning humidity",
            "Rapid collapse and rotting of entire vines with an offensive odor",
            "Reddish-brown granular rot extending into tuber flesh beneath the skin"
        ],
        "causes": "Phytophthora infestans overwintering in seed tubers, cull piles, and volunteer potatoes. Airborne sporangia travel miles in cloudy, humid winds.",
        "favored_environment": {
            "temp_range": "12°C - 22°C",
            "humidity": "> 90%",
            "soil_moisture": "Persistent wet canopy or waterlogged soil",
            "key_vector": "Wind-driven sporangia, infected cull piles"
        },
        "immediate_actions": [
            "Destroy and bury all infected plants in the outbreak zone immediately.",
            "If near harvest, kill vines with registered desiccant to prevent tuber contamination.",
            "Destroy all volunteer potato plants and dump piles on the property."
        ],
        "crop_management": [
            "Never leave unharvested potato cull piles in open air; bury under at least 2 feet of soil.",
            "Ensure broad hill ridges to create a physical soil buffer over tubers.",
            "Delay harvest at least 14 days after vine kill to ensure sporangia on soil surface have died."
        ],
        "treatments": {
            "organic": ["Preventative copper-based compounds applied strictly before infection."],
            "chemical": ["Systemic fungicides: cyazofamid, fluopicolide, or metalaxyl-M (where no resistance exists)."],
            "safety_disclaimer": "Check regional late blight forecasting warnings before making chemical applications."
        },
        "prevention": [
            "Plant certified disease-tested seed tubers.",
            "Avoid low-lying field areas with poor cold-air drainage.",
            "Use drip irrigation rather than center-pivot sprinklers."
        ],
        "monitoring_checklist": [
            "Scout lowest, wettest parts of the field daily when fog or dew persists.",
            "Examine stems closely for dark brown lesions."
        ]
    },
    "potato_healthy": {
        "crop": "Potato",
        "condition": "Healthy Plant",
        "scientific_name": "Solanum tuberosum",
        "pathogen_type": "None (Healthy)",
        "is_healthy": True,
        "default_severity": "None",
        "risk_level": "Low",
        "description": "Vigorous potato vine with uniform deep green compound leaves, healthy petioles, and no signs of blighting or leaf spot.",
        "symptoms": [
            "Even green foliage with healthy turgid stems",
            "No dark water-soaked spots, necrosis, or chlorosis",
            "Strong canopy coverage and blooming flower clusters where applicable"
        ],
        "causes": "Optimal soil moisture, balanced nitrogen-potassium ratio, and clean seed stock.",
        "favored_environment": {
            "temp_range": "16°C - 24°C",
            "humidity": "50% - 70%",
            "soil_moisture": "65% - 80%",
            "key_vector": "None"
        },
        "immediate_actions": ["Continue standard irrigation and weed control."],
        "crop_management": [
            "Maintain proper hilling to ensure tubers remain covered from light and greening.",
            "Monitor soil moisture to prevent hollow heart or growth cracks in tubers."
        ],
        "treatments": {
            "organic": ["Routine biological soil conditioning."],
            "chemical": ["No intervention required."],
            "safety_disclaimer": "Avoid non-target chemical sprays."
        },
        "prevention": ["Maintain sanitation and inspect perimeter traps."],
        "monitoring_checklist": ["Scout weekly for Colorado potato beetle and potato leafhopper."]
    },

    # CORN / MAIZE
    "corn_common_rust": {
        "crop": "Corn",
        "condition": "Common Rust",
        "scientific_name": "Puccinia sorghi",
        "pathogen_type": "Fungus",
        "is_healthy": False,
        "default_severity": "Moderate",
        "risk_level": "Moderate",
        "description": "Fungal leaf disease of sweet and field corn characterized by prominent reddish-brown powdery pustules scattered across both leaf surfaces.",
        "symptoms": [
            "Small, oval to elongate cinnamon-brown pustules (uredinia) on upper and lower leaves",
            "Pustules rupture epidermal tissue, releasing powdery rust-colored spores",
            "Surrounding leaf tissue becomes chlorotic in severe infestations",
            "Pustules darken to brownish-black late in the season (teliospores)"
        ],
        "causes": "Puccinia sorghi fungal spores are carried northward on prevailing summer winds from subtropical zones. Favored by high humidity (close to 100%) and cool-to-moderate temperatures.",
        "favored_environment": {
            "temp_range": "16°C - 25°C",
            "humidity": "> 85%",
            "soil_moisture": "Moderate",
            "key_vector": "Long-distance wind currents, dew duration > 6 hours"
        },
        "immediate_actions": [
            "Assess crop growth stage: rust emerging prior to silking warrants protective action.",
            "Ensure field air drainage is not blocked by overdense boundary brush."
        ],
        "crop_management": [
            "Prioritize rust-resistant corn hybrids in future plantings.",
            "Avoid planting very late in the season when windborne spore loads peak."
        ],
        "treatments": {
            "organic": ["Sulfur or biological fungicides (Bacillus based) on sweet corn."],
            "chemical": ["Strobilurin or Triazole foliar fungicides (e.g., pyraclostrobin, tebuconazole) applied around silking if rust severity is escalating."],
            "safety_disclaimer": "Economics depend on crop value (sweet corn vs field corn). Adhere to pesticide label restrictions."
        },
        "prevention": [
            "Select hybrids with Rp gene resistance against Puccinia sorghi.",
            "Implement early planting to outpace peak spore migration."
        ],
        "monitoring_checklist": [
            "Check lower to middle canopy leaves weekly starting at V6 growth stage.",
            "Distinguish common rust (elongate, scattered) from southern rust (tiny, crowded, yellow)."
        ]
    },
    "corn_northern_leaf_blight": {
        "crop": "Corn",
        "condition": "Northern Leaf Blight",
        "scientific_name": "Exserohilum turcicum",
        "pathogen_type": "Fungus",
        "is_healthy": False,
        "default_severity": "Severe",
        "risk_level": "High",
        "description": "A serious foliar fungal disease causing large, cigar-shaped grayish-green lesions that dry into tan necrotic strips, severely reducing photosynthetic capacity.",
        "symptoms": [
            "Long, elliptical, cigar-shaped lesions (2.5 to 15 cm long)",
            "Lesions begin grayish-green and dry to light tan or brown",
            "Dark powdery fungal spores form in concentric zones on lesion surface during damp conditions",
            "Extensive blighting causing entire leaves to die and wither"
        ],
        "causes": "Exserohilum turcicum overwinters in corn residue. Spores are splashed by rain and blown by wind during damp, moderate-temperature weather.",
        "favored_environment": {
            "temp_range": "18°C - 27°C",
            "humidity": "> 90%",
            "soil_moisture": "Heavy dew or rainfall",
            "key_vector": "Infected corn stubble, wind, rain splash"
        },
        "immediate_actions": [
            "Evaluate threshold: if lesions are present on ear leaf or two leaves below ear leaf at silking, prepare treatment.",
            "Maintain soil drainage."
        ],
        "crop_management": [
            "Tillage to bury corn stubble and accelerate residue decomposition.",
            "Implement a 1 to 2-year rotation with non-host crops (soybean, small grains)."
        ],
        "treatments": {
            "organic": ["Copper-based or bio-fungicide formulations."],
            "chemical": ["QoI, DMI, or SDHI fungicides (e.g., azoxystrobin + propiconazole) applied between VT and R2 stages."],
            "safety_disclaimer": "Consult university extension thresholds for economic return on fungicide application."
        },
        "prevention": [
            "Select resistant hybrids with Ht gene resistance.",
            "Avoid continuous no-till corn on corn."
        ],
        "monitoring_checklist": [
            "Check lower leaves first, tracking upward movement toward ear leaf.",
            "Scout fields during pre-tassel and silking stages."
        ]
    },
    "corn_healthy": {
        "crop": "Corn",
        "condition": "Healthy Plant",
        "scientific_name": "Zea mays",
        "pathogen_type": "None (Healthy)",
        "is_healthy": True,
        "default_severity": "None",
        "risk_level": "Low",
        "description": "Vibrant emerald green corn leaves with straight venation, upright architecture, and clean leaf collars.",
        "symptoms": [
            "Broad, smooth green leaves with crisp margins",
            "Thick, erect stalk and healthy brace roots",
            "No pustules, elongated lesions, or stripe chlorosis"
        ],
        "causes": "Adequate nitrogen, uniform spacing, and balanced moisture.",
        "favored_environment": {
            "temp_range": "20°C - 30°C",
            "humidity": "50% - 75%",
            "soil_moisture": "60% - 75%",
            "key_vector": "None"
        },
        "immediate_actions": ["Maintain sidedress nitrogen schedule."],
        "crop_management": ["Keep weeds suppressed during early canopy development."],
        "treatments": {
            "organic": ["Standard biological soil care."],
            "chemical": ["No fungicide needed."],
            "safety_disclaimer": "Avoid superfluous pesticide exposure."
        },
        "prevention": ["Maintain scouting schedule."],
        "monitoring_checklist": ["Monitor silk emergence and soil moisture."]
    },

    # APPLE
    "apple_scab": {
        "crop": "Apple",
        "condition": "Apple Scab",
        "scientific_name": "Venturia inaequalis",
        "pathogen_type": "Fungus",
        "is_healthy": False,
        "default_severity": "Moderate",
        "risk_level": "Moderate to High",
        "description": "The most economically damaging fungal disease of apples worldwide, causing velvety olive-green to black scabby lesions on leaves and fruit.",
        "symptoms": [
            "Velvety olive-green spots with indistinct borders on leaf surfaces",
            "Spots become metallic dark brown to black and leaf tissue curls or blisters",
            "Severe early infections cause heavy premature defoliation",
            "Dark corky, cracked scabs on developing apple fruit skin"
        ],
        "causes": "Venturia inaequalis overwinters in fallen orchard leaf litter. Ascospores discharge during spring rains, infecting tender new green tissue during periods of leaf wetness.",
        "favored_environment": {
            "temp_range": "13°C - 24°C",
            "humidity": "> 85%",
            "soil_moisture": "Wet spring conditions",
            "key_vector": "Discharged ascospores in spring rains"
        },
        "immediate_actions": [
            "Rake or flail-mow fallen orchard leaves to accelerate decomposition.",
            "Prune water sprouts and interior canopy to open sunlight corridors."
        ],
        "crop_management": [
            "Apply 5% urea spray to orchard floor in autumn to speed fallen leaf decay.",
            "Adopt open-center or central-leader pruning to maximize air circulation."
        ],
        "treatments": {
            "organic": ["Sulfur, Lime-sulfur, or Potassium bicarbonate applied before predicted rain."],
            "chemical": ["Captan, mancozeb, or myclobutanil timed according to Mills Apple Scab infection periods."],
            "safety_disclaimer": "Always observe pollinator protection restrictions; never apply insecticides during blossom."
        },
        "prevention": [
            "Plant scab-immune or resistant varieties (e.g., 'Liberty', 'Freedom', 'GoldRush').",
            "Track degree-day and leaf-wetness hours with orchard weather stations."
        ],
        "monitoring_checklist": [
            "Inspect cluster leaves at green tip, tight cluster, and petal fall.",
            "Record leaf wetness hours following every rain event."
        ]
    },
    "apple_cedar_rust": {
        "crop": "Apple",
        "condition": "Cedar Apple Rust",
        "scientific_name": "Gymnosporangium juniperi-virginianae",
        "pathogen_type": "Fungus",
        "is_healthy": False,
        "default_severity": "Moderate",
        "risk_level": "Moderate",
        "description": "Fungal rust requiring two alternating host species (apple and Eastern red cedar / juniper) to complete its complex multi-stage lifecycle.",
        "symptoms": [
            "Bright, conspicuous yellow-orange spots on the upper leaf surface",
            "Small black dots (pycnia) appear within the orange spots",
            "Small tube-like raised structures (aecia) protrude from leaf underside",
            "Fruit may develop shallow, firm orange blemishes"
        ],
        "causes": "Spores travel on wind from gelatinous orange galls on nearby juniper/cedar trees during warm spring rains.",
        "favored_environment": {
            "temp_range": "10°C - 24°C",
            "humidity": "> 80%",
            "soil_moisture": "Spring rain wetting",
            "key_vector": "Windblown aeciospores from cedar trees within 1-2 miles"
        },
        "immediate_actions": [
            "Inspect perimeter windbreaks for Eastern red cedar trees harboring galls.",
            "Remove cedar trees or prune galls within 500 feet of orchard where feasible."
        ],
        "crop_management": [
            "Choose rust-resistant apple varieties when establishing new orchards.",
            "Maintain general foliar health with balanced trace minerals."
        ],
        "treatments": {
            "organic": ["Preventative sulfur or bio-fungicide sprays."],
            "chemical": ["Myclobutanil, fenbuconazole, or mancozeb applied between pink bud and petal fall."],
            "safety_disclaimer": "Follow agricultural extension timings strictly."
        },
        "prevention": [
            "Plant resistant apple cultivars (e.g., 'Enterprise', 'Liberty', 'Redfree').",
            "Avoid ornamental juniper plantings adjacent to apple orchards."
        ],
        "monitoring_checklist": [
            "Check apple leaves 10 to 14 days after spring warm rains.",
            "Survey nearby juniper trees in early spring for gelatinous orange horns."
        ]
    },
    "apple_healthy": {
        "crop": "Apple",
        "condition": "Healthy Plant",
        "scientific_name": "Malus domestica",
        "pathogen_type": "None (Healthy)",
        "is_healthy": True,
        "default_severity": "None",
        "risk_level": "Low",
        "description": "Smooth, firm apple leaves with deep emerald pigmentation, serrated margins, and intact cuticle.",
        "symptoms": [
            "Uniform green leaf blade with clear central vein",
            "No orange rust spots, olive-green scabs, or powdery mildew",
            "Active terminal bud extension and balanced spur growth"
        ],
        "causes": "Proper dormant pruning, adequate sunlight, and balanced nutrition.",
        "favored_environment": {
            "temp_range": "18°C - 26°C",
            "humidity": "50% - 65%",
            "soil_moisture": "55% - 70%",
            "key_vector": "None"
        },
        "immediate_actions": ["Maintain standard orchard maintenance."],
        "crop_management": ["Prune dormant branches in late winter; thin excessive fruitlets in spring."],
        "treatments": {
            "organic": ["Maintain beneficial predatory mite populations."],
            "chemical": ["No intervention required."],
            "safety_disclaimer": "Avoid unnecessary chemical intervention."
        },
        "prevention": ["Maintain weed-free tree strips under canopies."],
        "monitoring_checklist": ["Monitor codling moth pheromone traps and foliage mite levels."]
    },

    # BELL PEPPER
    "pepper_bacterial_spot": {
        "crop": "Pepper",
        "condition": "Bacterial Spot",
        "scientific_name": "Xanthomonas campestris pv. vesicatoria",
        "pathogen_type": "Bacterium",
        "is_healthy": False,
        "default_severity": "Severe",
        "risk_level": "High",
        "description": "Bacterial pathogen attacking sweet bell and chili peppers, causing leaf spotting, yellowing, severe defoliation, and fruit lesions.",
        "symptoms": [
            "Small water-soaked blister-like spots on leaves turning brown or black",
            "Lesions often have raised surfaces or chlorotic yellow edges",
            "Significant premature leaf drop leaving fruit exposed to sunburn",
            "Rough, raised warts on pepper fruit skins"
        ],
        "causes": "Bacterial cells enter through natural openings and mechanical abrasions. High temperatures (24-32°C) combined with high humidity and rain splash drive epidemics.",
        "favored_environment": {
            "temp_range": "24°C - 32°C",
            "humidity": "> 80%",
            "soil_moisture": "High / Wet foliage",
            "key_vector": "Rain splash, handling wet plants, contaminated seeds"
        },
        "immediate_actions": [
            "Stop working in fields while morning dew is present on foliage.",
            "Remove and destroy severely blighted plants.",
            "Avoid overhead sprinkler irrigation."
        ],
        "crop_management": [
            "Provide ample spacing between pepper plants for wind penetration.",
            "Rotate beds with non-solanaceous crops for 2 to 3 years."
        ],
        "treatments": {
            "organic": ["Copper bactericides mixed with Bacillus bio-agents."],
            "chemical": ["Copper sulfate + mancozeb tank-mix applied early in epidemic."],
            "safety_disclaimer": "Adhere strictly to label rates to avoid copper phytotoxicity on tender pepper leaves."
        },
        "prevention": [
            "Purchase certified pathogen-indexed seeds or hot water treated seeds.",
            "Select pepper cultivars with multi-race bacterial spot resistance."
        ],
        "monitoring_checklist": [
            "Examine underside of leaves for water-soaked speckles following storm fronts.",
            "Inspect seedlings thoroughly before field transplanting."
        ]
    },
    "pepper_healthy": {
        "crop": "Pepper",
        "condition": "Healthy Plant",
        "scientific_name": "Capsicum annuum",
        "pathogen_type": "None (Healthy)",
        "is_healthy": True,
        "default_severity": "None",
        "risk_level": "Low",
        "description": "Glossy green pepper foliage with smooth unbroken surfaces, strong branching, and vigorous flower sets.",
        "symptoms": [
            "Uniform glossy leaf blades without spots or mottling",
            "Strong turgid stems and healthy root vigor",
            "Even green color with no interveinal chlorosis"
        ],
        "causes": "Optimal warm temperatures, balanced nitrogen and magnesium, regular moisture.",
        "favored_environment": {
            "temp_range": "21°C - 29°C",
            "humidity": "50% - 70%",
            "soil_moisture": "60% - 75%",
            "key_vector": "None"
        },
        "immediate_actions": ["Maintain balanced fertigation."],
        "crop_management": ["Mulch rows with plastic or straw to retain even soil moisture and suppress weeds."],
        "treatments": {
            "organic": ["Compost teas and beneficial mycorrhizal inoculation."],
            "chemical": ["None needed."],
            "safety_disclaimer": "Protect beneficial insect predators (ladybugs, lacewings)."
        },
        "prevention": ["Maintain weed-free beds and monitor drip lines."],
        "monitoring_checklist": ["Check leaf undersides for thrips, mites, or aphids."]
    },

    # GRAPE
    "grape_black_rot": {
        "crop": "Grape",
        "condition": "Black Rot",
        "scientific_name": "Guignardia bidwellii",
        "pathogen_type": "Fungus",
        "is_healthy": False,
        "default_severity": "Severe",
        "risk_level": "High",
        "description": "Devastating fungal disease affecting cultivated grapevines. Leaves develop reddish-brown circular spots, while grapes shrivel into hard, black, wrinkled mummies.",
        "symptoms": [
            "Small circular reddish-brown spots on leaves, turning dark with black pycnidia rings",
            "Sunken dark cankers on young canes and tendrils",
            "Infected berries turn soft, pale brown, then rapidly shrivel into wrinkled black mummies",
            "Mummified grapes remain firmly attached to the cluster"
        ],
        "causes": "Guignardia bidwellii overwinters in mummified berries on vines or vineyard floor. Ascospores infect young tissue during warm, rainy spring weather.",
        "favored_environment": {
            "temp_range": "21°C - 30°C",
            "humidity": "> 85%",
            "soil_moisture": "Spring wetness / 6+ hours leaf wetness",
            "key_vector": "Overwintered mummified berries, rain splash"
        },
        "immediate_actions": [
            "Prune out and destroy all mummified fruit clusters and infected canes during dormant pruning.",
            "Disrupt fallen leaves by light cultivation before spring budbreak."
        ],
        "crop_management": [
            "Train vines using trellis systems that maximize canopy air circulation.",
            "Shoot-position and remove lower leaves around grape clusters."
        ],
        "treatments": {
            "organic": ["Copper or sulfur applied early before flower bloom."],
            "chemical": ["Myclobutanil, kresoxim-methyl, or tebuconazole applied from pre-bloom through post-bloom."],
            "safety_disclaimer": "Always observe harvest intervals on wine and table grapes."
        },
        "prevention": [
            "Keep vineyard floor free of mummies and unpruned wild vitis vines nearby.",
            "Adopt resistant hybrid cultivars where suited."
        ],
        "monitoring_checklist": [
            "Scout young leaves beginning at 2 to 4 inch shoot growth.",
            "Closely observe fruit clusters during the 4 to 6 weeks following bloom."
        ]
    },
    "grape_healthy": {
        "crop": "Grape",
        "condition": "Healthy Plant",
        "scientific_name": "Vitis vinifera",
        "pathogen_type": "None (Healthy)",
        "is_healthy": True,
        "default_severity": "None",
        "risk_level": "Low",
        "description": "Vigorous palmate grapevine leaves with rich green coloration, clean sinus lobes, and strong tendril development.",
        "symptoms": [
            "Lush green foliage with crisp veins",
            "Intact leaf margins with zero necrotic spotting or powdery growth",
            "Clean shoots and uniform flowering or berry sizing"
        ],
        "causes": "Well-aerated canopy, proper mineral nutrition, and managed vine vigor.",
        "favored_environment": {
            "temp_range": "20°C - 30°C",
            "humidity": "45% - 65%",
            "soil_moisture": "50% - 65%",
            "key_vector": "None"
        },
        "immediate_actions": ["Maintain vine hedging and shoot positioning."],
        "crop_management": ["Manage canopy density through leaf pulling in cluster zone."],
        "treatments": {
            "organic": ["Maintain soil organic health and mycorrhizae."],
            "chemical": ["No fungicide needed."],
            "safety_disclaimer": "Preserve natural vineyard ecosystems."
        },
        "prevention": ["Maintain weed management and canopy aeration."],
        "monitoring_checklist": ["Check for early powdery mildew or leafhopper presence."]
    }
}

# Crop list for selection and auto-detection
SUPPORTED_CROPS = [
    {"id": "auto", "name": "Auto Detect", "description": "AI automatically identifies crop type"},
    {"id": "Tomato", "name": "Tomato", "description": "Solanum lycopersicum"},
    {"id": "Potato", "name": "Potato", "description": "Solanum tuberosum"},
    {"id": "Corn", "name": "Corn / Maize", "description": "Zea mays"},
    {"id": "Apple", "name": "Apple", "description": "Malus domestica"},
    {"id": "Grape", "name": "Grape", "description": "Vitis vinifera"},
    {"id": "Pepper", "name": "Pepper / Capsicum", "description": "Capsicum annuum"}
]
