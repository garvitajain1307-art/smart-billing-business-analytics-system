import { Monitor } from "lucide-react";
import "./MobileOnlyMessage.css";

const MobileOnlyMessage = () => {
  return (
    <div className="mobile-only-page">
      <div className="mobile-only-card">
        <Monitor size={55} />

        <h2>Desktop Experience Recommended</h2>

        <p>
          Smart Billing & Business Analytics System is currently optimized for
          desktop and laptop screens.
        </p>

        <p>Please access the application on a larger screen.</p>

        <span>Mobile support is coming soon.</span>
      </div>
    </div>
  );
};

export default MobileOnlyMessage;