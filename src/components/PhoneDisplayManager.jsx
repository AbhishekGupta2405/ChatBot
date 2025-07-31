import React from 'react';
import { useLanguage } from './LanguageContext';
import PhoneDetails from "./PhoneDetails.jsx";
import PhoneComparison from "./PhoneComparison.jsx";

const PhoneDisplayManager = ({
  showPhoneDetails,
  showPhoneComparison,
  selectedPhone,
  comparisonPhones,
  onClosePhoneDetails,
  onClosePhoneComparison
}) => {
  const { t } = useLanguage();

  if (!showPhoneDetails && !showPhoneComparison) {
    return null;
  }

  return (
    <div className="phone-content-area">
      {showPhoneDetails && (
        <div className="phone-details-inline">
          <button
            className="close-button-inline"
            style={{
              maxWidth: '8rem',
              display: 'flex',
              alignItems: 'left',
              alignSelf: 'left',
              justifyContent: 'left',
              background: 'linear-gradient(135deg, #4a90e2, #5bb0ff)',
              color: 'white',
              boxShadow: '0 4px 6px rgba(74, 144, 226, 0.3)', // corrected this line
              border: 'none',
              fontWeight: '600',
              letterSpacing: '0.3px',
              transition: 'all 0.2s ease',
              zIndex: '10001',
            }}
            onClick={onClosePhoneDetails}
          >
            {t.backToChat}
          </button>

          <PhoneDetails
            phone={selectedPhone}
            onClose={onClosePhoneDetails}
            inline={true}
          />
        </div>
      )}

      {showPhoneComparison && (
        <div className="phone-comparison-inline">
          <button
            className="close-button-inline"
            style={{
              maxWidth: '8rem',
              display: 'flex',
              alignItems: 'left',
              alignSelf: 'left',
              justifyContent: 'left',
              background: 'linear-gradient(135deg, #4a90e2, #5bb0ff)',
              color: 'white',
              boxShadow: '0 4px 6px rgba(74, 144, 226, 0.3)', // corrected this line
              border: 'none',
              fontWeight: '600',
              letterSpacing: '0.3px',
              transition: 'all 0.2s ease',
              zIndex: '10001',
            }}
            onClick={onClosePhoneComparison}
          >
            {t.backToChat}
          </button>

          <PhoneComparison
            phone1={comparisonPhones.phone1}
            phone2={comparisonPhones.phone2}
            onClose={onClosePhoneComparison}
            inline={true}
          />
        </div>
      )}
    </div>
  );
};

export default PhoneDisplayManager;