import React, { useEffect } from 'react';

const AdBanner = ({ slotId }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="my-6">
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_AD_CLIENT_ID"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  );
};

export default AdBanner;