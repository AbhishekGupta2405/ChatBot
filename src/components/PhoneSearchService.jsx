import { useCallback } from 'react';
import { searchPhones, comparePhones } from "../data/phone.js";

export const usePhoneSearchService = (
  language, 
  setSelectedPhone, 
  setShowPhoneDetails, 
  setComparisonPhones, 
  setShowPhoneComparison
) => {
  
  const handlePhoneSearch = useCallback((userQuery) => {
    const query = userQuery.toLowerCase();
    console.log("Search query:", query);

    // Check if it's a comparison request (English and Hindi)
    if (
      query.includes("compare") ||
      query.includes(" vs ") ||
      query.includes(" versus ") ||
      query.includes("तुलना") || // Hindi: comparison
      query.includes("बनाम") || // Hindi: vs/against
      query.includes("और") // Hindi: and
    ) {
      let phone1Query = "";
      let phone2Query = "";

      // Better parsing for comparison
      if (query.includes("compare")) {
        const parts = query.split("compare");
        if (parts.length >= 2) {
          const secondPart = parts[1].trim();
          if (secondPart.includes(" vs ")) {
            const vsParts = secondPart.split(" vs ");
            phone1Query = vsParts[0].trim();
            phone2Query = vsParts[1].trim();
          } else if (secondPart.includes(" and ")) {
            const andParts = secondPart.split(" and ");
            phone1Query = andParts[0].trim();
            phone2Query = andParts[1].trim();
          } else if (secondPart.includes(" with ")) {
            const withParts = secondPart.split(" with ");
            phone1Query = withParts[0].trim();
            phone2Query = withParts[1].trim();
          }
        }
      } else if (query.includes(" vs ")) {
        const vsParts = query.split(" vs ");
        phone1Query = vsParts[0].trim();
        phone2Query = vsParts[1].trim();
      }

      console.log("Comparison queries:", phone1Query, phone2Query);

      if (phone1Query && phone2Query) {
        const comparison = comparePhones(phone1Query, phone2Query);
        console.log("Comparison result:", comparison);

        if (comparison.phone1 || comparison.phone2) {
          setComparisonPhones(comparison);
          setShowPhoneComparison(true);

          const phone1Name = comparison.phone1
            ? `${comparison.phone1.brand} ${comparison.phone1.model}`
            : (language === "EN" ? "Phone not found" : "फोन नहीं मिला");
          const phone2Name = comparison.phone2
            ? `${comparison.phone2.brand} ${comparison.phone2.model}`
            : (language === "EN" ? "Phone not found" : "फोन नहीं मिला");

          const responseText = language === "EN" 
            ? `Here's a comparison between ${phone1Name} and ${phone2Name}. Please check the detailed comparison on screen.`
            : `यहाँ ${phone1Name} और ${phone2Name} के बीच तुलना है। कृपया स्क्रीन पर विस्तृत तुलना देखें।`;
          return responseText;
        }
      }
    }

    // Regular search
    const results = searchPhones(query);
    console.log("Search results:", results);

    if (results.length > 0) {
      const phone = results[0];
      setSelectedPhone(phone);
      setShowPhoneDetails(true);

      const responseText = language === "EN"
        ? `Found ${phone.brand} ${phone.model}! You can find this phone at ${phone.store.name} on floor ${phone.store.floor}, shop number ${phone.store.shopNumber}. The price is ${phone.price}. Please check the detailed specifications on screen.`
        : `मिल गया ${phone.brand} ${phone.model}! आप इस फोन को ${phone.store.name} में मिल सकते हैं, फ्लोर ${phone.store.floor}, दुकान नंबर ${phone.store.shopNumber}। कीमत ${phone.price} है। कृपया स्क्रीन पर विस्तृत विशेषताएं देखें।`;
      return responseText;
    } else {
      return language === "EN"
        ? "Sorry, I couldn't find that phone in our mall. You can visit the official showroom at Tech Plaza, Ground Floor, Sector 18, Noida. Phone: +91-9876543210."
        : "खुशी, मुझे हमारे मॉल में वह फोन नहीं मिला। आप टेक प्लाजा, ग्राउंड फ्लोर, सेक्टर 18, नोएडा में आधिकारिक शोरूम जा सकते हैं। फोन: +91-9876543210।";
    }
  }, [language, setSelectedPhone, setShowPhoneDetails, setComparisonPhones, setShowPhoneComparison]);

  return { handlePhoneSearch };
};