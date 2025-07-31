import React from 'react';
import './PhoneComparison.css';

const PhoneComparison = ({ phone1, phone2, onClose, inline = false }) => {
  if (!phone1 && !phone2) return null;

  const renderPhoneCard = (phone, title) => {
    if (!phone) {
      return (
        <div className="phone-card not-found">
          <h3>{title}</h3>
          <p>Phone not found in our database</p>
          <div className="showroom-info">
            <h4>Available at Showroom:</h4>
            <p><strong>Address:</strong> Tech Plaza, Ground Floor</p>
            <p><strong>Location:</strong> Sector 18, Noida</p>
            <p><strong>Phone:</strong> +91-9876543210</p>
          </div>
        </div>
      );
    }

    return (
      <div className="phone-card">
        <div className="phone-card-header">
          <h3>{phone.brand} {phone.model}</h3>
          <p className="price">{phone.price}</p>
        </div>
        
        <div className="phone-card-image">
          <div className="phone-image-container">
            <img 
              src={phone.image} 
              alt={`${phone.brand} ${phone.model}`}
              className="phone-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/200x250?text=Phone+Image';
              }}
            />
          </div>
        </div>
        
        <div className="phone-card-specs">
          <div className="spec-row">
            <span className="spec-label">Processor:</span>
            <span className="spec-value">{phone.specs.processor}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Screen:</span>
            <span className="spec-value">{phone.specs.screen}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Camera:</span>
            <span className="spec-value">{phone.specs.camera}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Battery:</span>
            <span className="spec-value">{phone.specs.battery}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Storage:</span>
            <span className="spec-value">{phone.specs.storage}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">OS:</span>
            <span className="spec-value">{phone.specs.os}</span>
          </div>
        </div>
        
        <div className="phone-card-location">
          <h4>Store Location</h4>
          <p><strong>Store:</strong> {phone.store.name}</p>
          <p><strong>Floor:</strong> {phone.store.floor}</p>
          <p><strong>Shop:</strong> {phone.store.shopNumber}</p>
        </div>
      </div>
    );
  };

  if (inline) {
    // Inline version without overlay
    return (
      <div>
        <div className="comparison-header">
          <h2>Phone Comparison</h2>
        </div>
        
        <div className="comparison-content">
          {renderPhoneCard(phone1, "Phone 1")}
          <div className="vs-divider">
            <span>VS</span>
          </div>
          {renderPhoneCard(phone2, "Phone 2")}
        </div>
      </div>
    );
  }

  // Original overlay version
  return (
    <div className="phone-comparison-overlay">
      <div className="phone-comparison-container">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        
        <div className="comparison-header">
          <h2>Phone Comparison</h2>
        </div>
        
        <div className="comparison-content">
          {renderPhoneCard(phone1, "Phone 1")}
          <div className="vs-divider">
            <span>VS</span>
          </div>
          {renderPhoneCard(phone2, "Phone 2")}
        </div>
      </div>
    </div>
  );
};

export default PhoneComparison;
