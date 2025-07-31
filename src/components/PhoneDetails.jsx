import React from 'react';
import './PhoneDetails.css';

const PhoneDetails = ({ phone, onClose, inline = false }) => {
  if (!phone) return null;

  if (inline) {
    // Inline version without overlay
    return (
      <div className="phone-details-content">
        <div className="phone-image-section">
          <div className="phone-image-container">
            <img 
              src={phone.image} 
              alt={`${phone.brand} ${phone.model}`}
              className="phone-image"
              style={{ width: '100%', height: '100%' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x400?text=Phone+Image';
              }}
            />
          </div>
        </div>
        
        <div className="phone-info-section">
          <div className="phone-header">
            <h2 className="phone-title">{phone.brand} {phone.model}</h2>
            <p className="phone-price">{phone.price}</p>
          </div>
          
          <div className="phone-specs">
            <h3>Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Processor:</span>
                <span className="spec-value">{phone.specs.processor}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Screen:</span>
                <span className="spec-value">{phone.specs.screen}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Camera:</span>
                <span className="spec-value">{phone.specs.camera}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Battery:</span>
                <span className="spec-value">{phone.specs.battery}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Storage:</span>
                <span className="spec-value">{phone.specs.storage}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">OS:</span>
                <span className="spec-value">{phone.specs.os}</span>
              </div>
            </div>
          </div>
          
          <div className="phone-location">
            <h3>Store Location</h3>
            <div className="location-info">
              <p><strong>Store:</strong> {phone.store.name}</p>
              <p><strong>Floor:</strong> {phone.store.floor}</p>
              <p><strong>Shop Number:</strong> {phone.store.shopNumber}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original overlay version
  return (
    <div className="phone-details-overlay">
      <div className="phone-details-container">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        
        <div className="phone-details-content">
          <div className="phone-image-section">
            <div className="phone-image-container">
              <img 
                src={phone.image} 
                alt={`${phone.brand} ${phone.model}`}
                className="phone-image"
                style={{ width: '100%', height: '100%' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x400?text=Phone+Image';
                }}
              />
            </div>
          </div>
          
          <div className="phone-info-section">
            <div className="phone-header">
              <h2 className="phone-title">{phone.brand} {phone.model}</h2>
              <p className="phone-price">{phone.price}</p>
            </div>
            
            <div className="phone-specs">
              <h3>Specifications</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Processor:</span>
                  <span className="spec-value">{phone.specs.processor}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Screen:</span>
                  <span className="spec-value">{phone.specs.screen}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Camera:</span>
                  <span className="spec-value">{phone.specs.camera}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Battery:</span>
                  <span className="spec-value">{phone.specs.battery}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Storage:</span>
                  <span className="spec-value">{phone.specs.storage}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">OS:</span>
                  <span className="spec-value">{phone.specs.os}</span>
                </div>
              </div>
            </div>
            
            <div className="phone-location">
              <h3>Store Location</h3>
              <div className="location-info">
                <p><strong>Store:</strong> {phone.store.name}</p>
                <p><strong>Floor:</strong> {phone.store.floor}</p>
                <p><strong>Shop Number:</strong> {phone.store.shopNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneDetails;
