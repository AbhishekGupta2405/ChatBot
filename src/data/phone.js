// Import all phone images at the top of the file
import samsungGalaxyS25Ultra from '../assets/images/samsung-galaxy-s25-ultra.webp';
import googlePixel9Pro from '../assets/images/google-pixel-9-pro.webp';
import iphone16ProMax from '../assets/images/iphone-16-pro-max.jpg';
import oneplus13 from '../assets/images/oneplus-13.jpeg';
import xiaomi15Ultra from '../assets/images/xiaomi-15-ultra.png';
import googlePixel9a from '../assets/images/google-pixel-9a.jpeg';
import honorMagic7Pro from '../assets/images/honor-magic-7-pro.jpeg';
import vivoT4Ultra from '../assets/images/vivo-t4-ultra.jpeg';
import samsungGalaxyZFlip7 from '../assets/images/samsung-galaxy-z-flip-7.webp';
import oppoReno14Pro from '../assets/images/oppo-reno14-pro.jpeg';


export const smartphoneMallData = {
    stores: [
      {
        name: "TechWorld Electronics",
        floor: 1,
        shopNumber: "101",
        products: [
          {
            brand: "Samsung",
            model: "Galaxy S25 Ultra",
            specs: {
              processor: "Snapdragon 8 Gen 3",
              screen: "6.8 inch AMOLED",
              camera: "200MP triple camera",
              battery: "5000 mAh",
              storage: "512GB",
              os: "Android 15"
            },
            price: "₹99,517",
            image: samsungGalaxyS25Ultra
          },
          {
            brand: "Google",
            model: "Pixel 9 Pro",
            specs: {
              processor: "Google Tensor G4",
              screen: "6.7 inch OLED",
              camera: "50MP dual camera",
              battery: "4800 mAh",
              storage: "256GB",
              os: "Android 15"
            },
            price: "₹74,617",
            image: googlePixel9Pro
          }
        ]
      },
      {
        name: "Mobile Hub",
        floor: 2,
        shopNumber: "205",
        products: [
          {
            brand: "Apple",
            model: "iPhone 16 Pro Max",
            specs: {
              processor: "Apple A18 Bionic",
              screen: "6.7 inch OLED",
              camera: "48MP triple camera",
              battery: "4300 mAh",
              storage: "512GB",
              os: "iOS 19"
            },
            price: "₹1,16,117",
            image: iphone16ProMax
          },
          {
            brand: "OnePlus",
            model: "OnePlus 13",
            specs: {
              processor: "Snapdragon 8 Gen 3",
              screen: "6.7 inch AMOLED",
              camera: "50MP triple camera",
              battery: "4800 mAh",
              storage: "256GB",
              os: "Android 15"
            },
            price: "₹66,317",
            image: oneplus13
          }
        ]
      },
      {
        name: "SmartPhone Stop",
        floor: 3,
        shopNumber: "310",
        products: [
          {
            brand: "Xiaomi",
            model: "Xiaomi 15 Ultra",
            specs: {
              processor: "Snapdragon 8 Gen 3+",
              screen: "6.7 inch AMOLED",
              camera: "200MP quad camera",
              battery: "5000 mAh",
              storage: "512GB",
              os: "Android 15"
            },
            price: "₹91,217",
            image: xiaomi15Ultra
          },
          {
            brand: "Google",
            model: "Pixel 9a",
            specs: {
              processor: "Google Tensor G4 Lite",
              screen: "6.2 inch OLED",
              camera: "48MP single camera",
              battery: "4400 mAh",
              storage: "128GB",
              os: "Android 15"
            },
            price: "₹41,417",
            image: googlePixel9a
          }
        ]
      },
      {
        name: "Elite Mobiles",
        floor: 1,
        shopNumber: "115",
        products: [
          {
            brand: "Honor",
            model: "Magic 7 Pro",
            specs: {
              processor: "Snapdragon 8 Gen 3",
              screen: "6.8 inch OLED",
              camera: "50MP triple camera",
              battery: "5100 mAh",
              storage: "512GB",
              os: "Android 15"
            },
            price: "₹78,767",
            image: honorMagic7Pro
          },
          {
            brand: "Vivo",
            model: "T4 Ultra",
            specs: {
              processor: "MediaTek Dimensity 9300 Plus",
              screen: "6.67 inch AMOLED",
              camera: "50MP triple camera",
              battery: "5500 mAh",
              storage: "256GB",
              os: "Android 15"
            },
            price: "₹58,017",
            image: vivoT4Ultra
          }
        ]
      },
      {
        name: "Premium Phone Palace",
        floor: 2,
        shopNumber: "220",
        products: [
          {
            brand: "Samsung",
            model: "Galaxy Z Flip 7",
            specs: {
              processor: "Snapdragon 8 Gen 3",
              screen: "6.7 inch foldable AMOLED",
              camera: "50MP dual camera",
              battery: "3700 mAh",
              storage: "256GB",
              os: "Android 15"
            },
            price: "₹91,217",
            image: samsungGalaxyZFlip7
          },
          {
            brand: "OPPO",
            model: "Reno14 Pro",
            specs: {
              processor: "MediaTek Dimensity 8450",
              screen: "6.83 inch OLED",
              camera: "50MP triple camera",
              battery: "6200 mAh",
              storage: "256GB",
              os: "Android 15"
            },
            price: "₹62,167",
            image: oppoReno14Pro
          }
        ]
      }
    ]
  };
  
  // Search functionality
  export const searchPhones = (query) => {
    const results = [];
    const queryLower = query.toLowerCase();
    
    // Hindi to English keyword mapping
    const hindiKeywordMap = {
      'आईफोन': 'iphone',
      'गैलेक्सी': 'galaxy',
      'पिक्सल': 'pixel',
      'वनप्लस': 'oneplus',
      'शाओमी': 'xiaomi',
      'सैमसंग': 'samsung',
      'एप्पल': 'apple',
      'गूगल': 'google',
      'ऑनर': 'honor',
      'विवो': 'vivo',
      'ओप्पो': 'oppo',
      'कैमरा': 'camera',
      'बैटरी': 'battery',
      'स्टोरेज': 'storage',
      'प्रोसेसर': 'processor'
    };
    
    // Convert Hindi keywords to English for searching
    let searchQuery = queryLower;
    Object.keys(hindiKeywordMap).forEach(hindiWord => {
      if (searchQuery.includes(hindiWord)) {
        searchQuery = searchQuery.replace(new RegExp(hindiWord, 'g'), hindiKeywordMap[hindiWord]);
      }
    });
    
    smartphoneMallData.stores.forEach(store => {
      store.products.forEach(product => {
        const brandModel = `${product.brand} ${product.model}`.toLowerCase();
        const brand = product.brand.toLowerCase();
        const model = product.model.toLowerCase();
        
        // Check for exact brand/model matches first (using both original and converted query)
        if (brandModel.includes(queryLower) || 
            brandModel.includes(searchQuery) ||
            queryLower.includes(brand) || 
            queryLower.includes(model) ||
            searchQuery.includes(brand) ||
            searchQuery.includes(model) ||
            // Check for specific phone names (English and converted Hindi)
            ((queryLower.includes('iphone') || searchQuery.includes('iphone')) && brand === 'apple') ||
            ((queryLower.includes('galaxy') || searchQuery.includes('galaxy')) && brand === 'samsung') ||
            ((queryLower.includes('pixel') || searchQuery.includes('pixel')) && brand === 'google') ||
            ((queryLower.includes('oneplus') || searchQuery.includes('oneplus')) && brand === 'oneplus') ||
            ((queryLower.includes('xiaomi') || searchQuery.includes('xiaomi')) && brand === 'xiaomi') ||
            // Check for specs if no direct match
            ((queryLower.includes('camera') || searchQuery.includes('camera')) && product.specs.camera.toLowerCase().includes('200mp')) ||
            ((queryLower.includes('samsung') || searchQuery.includes('samsung')) && brand === 'samsung') ||
            ((queryLower.includes('apple') || searchQuery.includes('apple')) && brand === 'apple') ||
            ((queryLower.includes('google') || searchQuery.includes('google')) && brand === 'google') ||
            ((queryLower.includes('honor') || searchQuery.includes('honor')) && brand === 'honor') ||
            ((queryLower.includes('vivo') || searchQuery.includes('vivo')) && brand === 'vivo') ||
            ((queryLower.includes('oppo') || searchQuery.includes('oppo')) && brand === 'oppo')) {
          
          results.push({
            ...product,
            store: {
              name: store.name,
              floor: store.floor,
              shopNumber: store.shopNumber
            }
          });
        }
      });
    });
    
    // Sort results by relevance (exact matches first)
    return results.sort((a, b) => {
      const aExact = `${a.brand} ${a.model}`.toLowerCase().includes(queryLower);
      const bExact = `${b.brand} ${b.model}`.toLowerCase().includes(queryLower);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });
  };
  
  // Compare two phones
  export const comparePhones = (phone1Query, phone2Query) => {
    const phone1Results = searchPhones(phone1Query);
    const phone2Results = searchPhones(phone2Query);
    
    return {
      phone1: phone1Results[0] || null,
      phone2: phone2Results[0] || null
    };
  };
  