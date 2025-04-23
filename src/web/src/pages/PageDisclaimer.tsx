import { useOutletContext } from "react-router-dom";
import { AppContext } from "../lib/types";

export const PageDisclaimer: React.FC = () => {
  const { acceptDisclaimer } = useOutletContext<AppContext>();

  return (
    <>
      <h1>
        <span className="rainbow">Disclaimer</span>
      </h1>
      <br />
      <div
        className="counter-cards"
        style={{ maxHeight: "600px", textAlign: "left" }}
      >
        <h3>SPAM Webapp Terms of Use</h3>
        <p style={{ padding: "0" }}>
          These terms of use (“<b>Terms</b>”) apply to your use of the SPAM
          Webapp (“<b>SPAM</b>” or “<b>Webapp</b>”) provided to you by the
          Rising Phoenix 2 Ltd. (“<b>we</b>”, “<b>us</b>” or “<b>ours</b>”). By
          accessing or using the Webapp, you agreed to be bound by these Terms.
          If you do not agree with any part of these Terms, you must not access
          or use SPAM.
        </p>
        <p style={{ padding: "0" }}>
          <b>Experimental Product and No Warranties</b>. SPAM is an experimental
          product and has been developed outside of a professional software
          development environment. It is provided purely on an "as is", “as
          available” and "with all faults" basis. By using SPAM, you assume all
          risks associated with its use.
        </p>
        <p style={{ padding: "0" }}>
          All representations, warranties, and guarantees, whether express,
          implied, statutory, or otherwise, are hereby disclaimed. This
          includes, but is not limited to, any warranties of merchantability,
          fitness for a particular purpose, title, non-infringement, accuracy,
          availability, or security. We do not guarantee that SPAM will operate
          without error, be secure, remain uninterrupted, or fulfill any
          specific expectations.
        </p>
        <p style={{ padding: "0" }}>
          SPAM is provided without warranty of any kind, express or implied. No
          assurance is given that SPAM will operate without error, be secure,
          remain uninterrupted, or fulfill any specific expectations. By using
          SPAM, you acknowledge and accept the inherent risk of bugs, errors,
          vulnerabilities, and potential interruptions. We are not liable for
          any damages or consequences resulting from such issues and you
          expressly release us from any liability in relation to your use of the
          product.
        </p>
        <p style={{ padding: "0" }}>
          <b>Limitation of Liability</b>. To the fullest extent permitted by
          law, we shall not be liable for any direct, indirect, incidental,
          special, consequential, exemplary, or punitive damages arising out of
          or related to your use of SPAM, including but not limited to:
        </p>
        <div className="tight">
          <p style={{ padding: "0" }}>
            - Loss of IOTA transaction fees, cryptocurrency, or other digital
            assets.
          </p>
          <p style={{ padding: "0" }}>
            - Loss of data, profits, business, or opportunities.
          </p>
          <p style={{ padding: "0" }}>
            - Any damage to your device, software, or network.
          </p>
          <p style={{ padding: "0" }}>
            - Any claims by third parties, including IOTA or other blockchain
            network participants.
          </p>
        </div>
        <p style={{ padding: "0" }}>
          Our total liability, if any, shall be limited to $0.00 (zero U.S.
          dollars), as we derive no financial benefit from SPAM and cannot
          refund any losses.
        </p>
        <p style={{ padding: "0" }}>
          Furthermore, you hereby irrevocably waive any and all rights to claim
          damages or compensation from us, regardless of whether such claims
          arise under contract, tort (including negligence), statutory
          provisions, or any other legal doctrine.
        </p>
        <p style={{ padding: "0" }}>
          <b>Use at Your Own Risk</b>. By accessing, browsing, or using SPAM,
          you acknowledge and agree that you do so entirely at your own risk.
          You accept full responsibility for any risks, losses, or damages that
          may arise, including but not limited to financial losses from IOTA
          transaction fees, bugs, errors, or misuse of the Webapp.
        </p>
        <p style={{ padding: "0" }}>
          We may make reasonable efforts to ensure that SPAM is safe and
          functional, but we cannot guarantee its performance, security, or
          availability to any extent. You must evaluate the webapp’s suitability
          for your needs and accept the possibility of errors, failures, or
          interruptions.
        </p>
        <p style={{ padding: "0" }}>
          <b>Non-Commercial Nature, No Refunds or Support</b>. SPAM is provided
          free of charge and we do not receive any profit or financial benefit
          from its use, including from any IOTA transaction fees or any other
          associated costs associated with its use.
        </p>
        <p style={{ padding: "0" }}>
          We do not offer refunds, compensation, or technical support for SPAM.
          You are solely responsible for any costs associated with its use,
          including IOTA transaction fees. We cannot and will not refund any
          transaction fees or other losses if a bug, error, or service
          interruption prevents you from using the Webapp or claiming SPAM.
        </p>
        <p style={{ padding: "0", width: "100%" }}>
          There is no customer service, contact point, or user support
          available.
        </p>
        <p style={{ padding: "0" }}>
          <b>User Responsibilities and Risk Mitigation</b>. To minimize risks
          and avoid wasting IOTA transaction fees, you must follow these
          instructions:
        </p>
        <div className="tight">
          <p style={{ padding: "0" }}>
            - Register your counter the day after you use it for spamming via
            SPAM; failure to do so may prevent you from claiming SPAM.
          </p>
          <p style={{ padding: "0" }}>
            - Use your SPAM Webapp account or wallet exclusively for spamming
            SPAM; do not send other transactions from the associated address
            using an IOTA wallet.
          </p>
          <p style={{ padding: "0" }}>
            - Ensure you stop any automated processes or interactions with SPAM
            before withdrawing SPAM or accessing your IOTA wallet; failure to do
            so may increase the risk of errors or financial loss.
          </p>
        </div>
        <p style={{ padding: "0" }}>
          Failure to follow these instructions may increase the risk of bugs,
          errors, or financial loss, for which we accept no liability.
        </p>
        <p style={{ padding: "0" }}>
          <b>Voluntary Use and Acceptance</b>. Your use of SPAM is entirely
          voluntary. By accessing or using SPAM, you affirm that you have read,
          understood, and agreed to these Terms, and you waive any claims
          against us for any damages or losses, even if we have been advised of
          the possibility of such damages.
        </p>
        <p style={{ padding: "0", width: "100%" }}>
          If you are not comfortable with these risks, <b>DO NOT USE SPAM</b>.
        </p>
        <p style={{ padding: "0" }}>
          <b>Governing Law and Jurisdiction</b>. These Terms are governed by and
          construed in accordance with the laws of the British Virgin Islands,
          without regard to its conflict of laws principles. Any disputes
          arising from or related to this disclaimer or SPAM shall be resolved
          exclusively in the state or federal courts of British Virgin Islands
          and you consent to the personal jurisdiction of such courts.
        </p>
        <p style={{ padding: "0" }}>
          <b>Severability and Entire Agreement</b>. If any provision of these
          Terms is found to be unenforceable or invalid, the remaining
          provisions will remain in full force and effect. These Terms
          constitute the complete and exclusive agreement governing your
          utilization of SPAM. No additional representations, warranties, or
          conditions shall be applicable beyond those expressly set forth
          herein.
        </p>
        <p style={{ padding: "0" }}>
          <b>No Third-Party Beneficiaries</b>. These Terms do not confer any
          rights or remedies on any third parties, including the IOTA network or
          any other blockchain networks.
        </p>
        <p style={{ padding: "0" }}>
          <b>Best Intent</b>. SPAM is provided in good faith, with no intent to
          deceive or harm users. All known risks and limitations have been
          disclosed to the best of our knowledge, however, the product may
          contain bugs, errors and vulnerabilities. Therefore, any use of the
          product is at the sole risk of the user.
        </p>
        <p style={{ padding: "0" }}>
          <b>Amendments</b>. These Terms may be amended at any time without
          notice. Your continued use of SPAM after any changes constitutes your
          acceptance of the updated Terms.
        </p>
        <p style={{ padding: "0" }}>
          <b>No customer service or contact information</b>. There is no public
          or private contact information available. All use of SPAM is at your
          own risk and without recourse to support or communications.
        </p>

        <button
          className="btn"
          style={{ width: "100%" }}
          onClick={acceptDisclaimer}
        >
          Agree
        </button>
      </div>
    </>
  );
};
