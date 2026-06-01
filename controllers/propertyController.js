const knex = require('../db')
const translateText = require('../translateText')

const addProperty = async (
    req,
    res
) => {
    try {
        console.log(req.body)

        const {
            VideoLink,
            aboutProperty,
            address,
            amenities,
            attachment,
            city,
            country,
            description,
            embedVideo,
            lang,
            postEmail,
            postName,
            profileUrl,
            propertyAC,
            propertyAvailableCurtains,
            propertyAvailableFrom,
            propertyBalcony,
            propertyBathrooms,
            propertyBedrooms,
            propertyCategory,
            propertyCurrency,
            propertyFloor,
            propertyFridge,
            propertyGarageSize,
            propertyMicrowave,
            propertyName,
            propertyOfferPrice,
            propertyParking,
            propertyPriceSale,
            propertyPropertyId,
            propertySqft,
            propertyStructureType,
            propertyTV,
            propertyType,
            propertyWardrobe,
            propertyWaterPurifier,
            propertyYearConstructed,
            state,
        } = req.body

        // language direction
        const fromLang =
            lang === 'bn'
                ? 'bn'
                : 'en'

        const toLang =
            lang === 'bn'
                ? 'en'
                : 'bn'

        // safe translate helper
        const safeTranslate =
            async text => {
                if (
                    !text ||
                    typeof text !==
                    'string'
                ) {
                    return ''
                }

                return await translateText(
                    text,
                    fromLang,
                    toLang
                )
            }

        // translations
        const translatedName =
            await safeTranslate(
                propertyName
            )

        const translatedDescription =
            await safeTranslate(
                description
            )

        const translatedAbout =
            await safeTranslate(
                aboutProperty
            )

        const translatedAddress =
            await safeTranslate(
                address
            )

        const translatedCity =
            await safeTranslate(
                city
            )

        const translatedState =
            await safeTranslate(
                state
            )

        const translatedCountry =
            await safeTranslate(
                country
            )
        const translatedPropertyType =
            await safeTranslate(
                propertyType
            )
        const translatePropertyCategory =
            await safeTranslate(
                propertyCategory
            )
        const translatePropertyStructureType =
            await safeTranslate(
                propertyStructureType
            )
        // multilingual object
        const createLangObject = (
            original,
            translated
        ) => {
            return lang ===
                'bn'
                ? {
                    bn:
                        original ||
                        '',
                    en:
                        translated ||
                        '',
                }
                : {
                    en:
                        original ||
                        '',
                    bn:
                        translated ||
                        '',
                }
        }

        await knex(
            'properties'
        ).insert({
            // multilingual
            property_name:
                JSON.stringify(
                    createLangObject(
                        propertyName,
                        translatedName
                    )
                ),

            description:
                JSON.stringify(
                    createLangObject(
                        description,
                        translatedDescription
                    )
                ),

            about_property:
                JSON.stringify(
                    createLangObject(
                        aboutProperty,
                        translatedAbout
                    )
                ),

            address:
                JSON.stringify(
                    createLangObject(
                        address,
                        translatedAddress
                    )
                ),

            city: JSON.stringify(
                createLangObject(
                    city,
                    translatedCity
                )
            ),

            state:
                JSON.stringify(
                    createLangObject(
                        state,
                        translatedState
                    )
                ),

            country:
                JSON.stringify(
                    createLangObject(
                        country,
                        translatedCountry
                    )
                ),

            property_type:
                JSON.stringify(
                    createLangObject(
                        propertyType,
                        translatedPropertyType
                    )
                ),

            property_category:
                JSON.stringify(
                    createLangObject(
                        propertyCategory,
                        translatePropertyCategory
                    )
                ),

            property_structure_type:
                JSON.stringify(
                    createLangObject(
                        propertyStructureType,
                        translatePropertyStructureType
                    )
                ),

            // user info
            post_name: req.user.name || '',
            post_email: req.user.email || '',
            profileUrl: req.user.photo || profileUrl || '',

            // media
            video_link:
                VideoLink || '',

            embed_video:
                embedVideo || '',

            attachment:
                JSON.stringify(
                    attachment || []
                ),

            amenities:
                JSON.stringify(
                    amenities || []
                ),

            property_property_id:
                propertyPropertyId ||
                '',

            property_currency:
                propertyCurrency ||
                '',

            // pricing
            property_price_sale:
                Number(
                    propertyPriceSale
                ) || 0,

            property_offer_price:
                Number(
                    propertyOfferPrice
                ) || 0,

            // numbers
            property_sqft:
                Number(
                    propertySqft
                ) || 0,

            property_bedrooms:
                Number(
                    propertyBedrooms
                ) || 0,

            property_bathrooms:
                Number(
                    propertyBathrooms
                ) || 0,

            property_floor:
                Number(
                    propertyFloor
                ) || 0,

            property_garage_size:
                Number(
                    propertyGarageSize
                ) || 0,

            property_parking:
                Number(
                    propertyParking
                ) || 0,

            property_ac:
                Number(
                    propertyAC
                ) || 0,

            property_fridge:
                Number(
                    propertyFridge
                ) || 0,

            property_tv:
                Number(
                    propertyTV
                ) || 0,

            property_microwave:
                Number(
                    propertyMicrowave
                ) || 0,

            property_wardrobe:
                Number(
                    propertyWardrobe
                ) || 0,

            property_water_purifier:
                Number(
                    propertyWaterPurifier
                ) || 0,

            // yes/no
            property_balcony:
                propertyBalcony ||
                'no',

            property_available_curtains:
                propertyAvailableCurtains ===
                'yes',

            // dates
            property_available_from:
                propertyAvailableFrom
                    ? new Date(propertyAvailableFrom)
                        .toISOString()
                        .split('T')[0]
                    : null,

            property_year_constructed:
                propertyYearConstructed
                    ? new Date(propertyYearConstructed)
                        .toISOString()
                        .split('T')[0]
                    : null,

        })

        res.status(201).json({
            success: true,
            message:
                'Property added successfully',
        })
    } catch (error) {
        console.log(
            'Property Save Error:',
            error
        )

        res.status(500).json({
            success: false,
            message:
                'Something went wrong',
            error:
                error.message,
        })
    }
}
const getProperties =
    async (req, res) => {
        try {
            const properties =
                await knex(
                    'properties'
                )
                    .select('*')
                    .orderBy(
                        'id',
                        'desc'
                    )

            res.status(200).json({
                success: true,
                data: properties,
            })
        } catch (error) {
            console.log(error)

            res.status(500).json({
                success: false,
                message:
                    'Failed to fetch properties',
            })
        }
    }


const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;


        const property = await knex('properties')
            .where({ id: id })
            .first();
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "প্রপার্টিটি পাওয়া যায়নি!"
            });
        }


        res.status(200).json({
            success: true,
            data: property
        });

    } catch (error) {
        console.log('Fetch Property By ID Error:', error);
        res.status(500).json({
            success: false,
            message: "সার্ভারে সমস্যা হয়েছে",
            error: error.message
        });
    }
};


const getBuyProperties = async (req, res) => {
    try {

        const properties = await knex('properties')
            .whereRaw("property_type::text ILIKE ?", ['%Buy%'])
            .orderBy('id', 'desc');

        if (!properties || properties.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: "No buy properties found"
            });
        }

        // ডাবল-স্ট্রিং বা সিঙ্গেল-স্ট্রিং যাই হোক, ক্র্যাশ না করে অবজেক্টে রূপান্তর করার মাস্টার হেল্পার
        const safeParse = (field) => {
            if (!field) return null;
            if (typeof field === 'object') return field;

            try {
                let parsed = JSON.parse(field);
                // যদি ডাবল-স্ট্রিং হয় (অর্থাৎ পার্স করার পরও আবার স্ট্রিং থেকে যায়)
                if (typeof parsed === 'string') {
                    parsed = JSON.parse(parsed);
                }
                return parsed;
            } catch (e) {
                return field;
            }
        };

        const parsedProperties = properties.map(property => {
            return {
                ...property,
                property_name: safeParse(property.property_name),
                description: safeParse(property.description),
                about_property: safeParse(property.about_property),
                address: safeParse(property.address),
                city: safeParse(property.city),
                state: safeParse(property.state),
                country: safeParse(property.country),
                property_type: safeParse(property.property_type),
                property_category: safeParse(property.property_category),
                property_structure_type: safeParse(property.property_structure_type),
                attachment: safeParse(property.attachment) || [],
                amenities: safeParse(property.amenities) || []
            };
        });

        res.status(200).json({
            success: true,
            data: parsedProperties,
        });

    } catch (error) {
        console.log('Fetch Buy Properties Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch buy properties',
            error: error.message
        });
    }
};
const getSellProperties = async (req, res) => {
    try {

        const properties = await knex('properties')
            .whereRaw("property_type::text ILIKE ?", ['%Sell%'])
            .orderBy('id', 'desc');

        if (!properties || properties.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: "No sell properties found"
            });
        }


        const safeParse = (field) => {
            if (!field) return null;
            if (typeof field === 'object') return field;

            try {
                let parsed = JSON.parse(field);

                if (typeof parsed === 'string') {
                    parsed = JSON.parse(parsed);
                }
                return parsed;
            } catch (e) {
                return field;
            }
        };

        const parsedProperties = properties.map(property => {
            return {
                ...property,
                property_name: safeParse(property.property_name),
                description: safeParse(property.description),
                about_property: safeParse(property.about_property),
                address: safeParse(property.address),
                city: safeParse(property.city),
                state: safeParse(property.state),
                country: safeParse(property.country),
                property_type: safeParse(property.property_type),
                property_category: safeParse(property.property_category),
                property_structure_type: safeParse(property.property_structure_type),
                attachment: safeParse(property.attachment) || [],
                amenities: safeParse(property.amenities) || []
            };
        });

        res.status(200).json({
            success: true,
            data: parsedProperties,
        });

    } catch (error) {
        console.log('Fetch Buy Properties Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch buy properties',
            error: error.message
        });
    }
};
module.exports = {
    addProperty,
    getProperties,
    getPropertyById,
    getBuyProperties,
    getSellProperties
}