export const adminCreateUserTemplate = `
<div style="font-size:20px;color:blue;">
    Welcome {{{ name}}} to UAC. 
</div>
<div style="font-size:18px;color:green;">
    Your email address is {{{ email }}} and your temporary password is <strong>{{{ code }}}</strong>
</div>
<div style="font-size:16px;color:red;">
    Please note: Your temporary password will be expired in 72 hours.
</div>
<div>
    Please check the <a href="https://uac.helpjuice.com/marketplace/secrets/9dAvPhMhiU9wIcL5Kdf-FQ" target="_blank">training guide</a>.
</div>
`;

export const forgotPasswordTemplate = `
    <div style="font-size:20px;color:blue;">
        Hi {{{ name }}}. Your password has been reset.
    </div>
    <div>
        your temporary password is <strong>{{{ password }}}</strong>
    </div>
    <div style="display: none;">
        your code is <strong>{{{ code }}}</strong>
    </div>
    <div style="font-size:16px;color:red;">
        Please note: Your temporary password will be expired in 72 hours.
    </div>
    <div>
      Please check the <a href="https://uac.helpjuice.com/marketplace/secrets/9dAvPhMhiU9wIcL5Kdf-FQ" target="_blank">training guide</a>.
    </div>
`;

export const testTemplate = `
<tr>
  <td align="center" style="width: 580px; height: 184px; background-color: #fbc02d;" >
    <img src="https://www.uac.edu.au/assets/images/UAC-Brand/uac_logo_fullname.png" alt="logo" width="300px" height="100px" /><br />
  
  </td>
</tr>
<tr>
  <td align="center" style="width: 580px; background-color: #ffffff;" >
    <table>
      <tr>
        <td style="width: 580px; height: 30px; mso-padding-alt: 10px;"></td>
      </tr>
      <tr>
        <td align="center" style="width: 246px; height: 48px; font-family: Verdana; font-size: 24px; font-weight: normal; font-stretch: normal; font-style: normal; line-height: 2; letter-spacing: normal; text-align: center; color: #2d2f33;">
            Activate your account
        </td>
      </tr>
      <tr>
        <td align="left" style="width: 448px; height: 48px; font-family: Verdana; font-size: 20px; font-weight: normal; font-stretch: normal; font-style: normal; line-height: 1.5; letter-spacing: normal; text-align: center; color: #4f5d71;">
              Hi {{{ name }}}, you've been invited to the UAC Provider Portal.
        </td>
      </tr>
      <tr>
        <td style="width: 580px; height: 45px; mso-padding-alt: 10px; display: none;">{{{ email }}}</td>
      </tr>
      <tr>
        <td align="center">
          <table>
            <tr>
              <td align="left" style="width: 448px; height: 48px; border-radius: 6px;">
                  <span align="left" style="width: 448px; height: 48px; font-family: Verdana; font-size: 22px; font-weight: normal; font-stretch: normal; font-style: normal; letter-spacing: normal; color: #4f5d71;">
                    Your temporary password is {{{ code }}}
                  </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center">
          <table>
            <tr>
              <td align="left" style="width: 448px; height: 48px; font-family: Verdana; font-size: 18px; font-weight: normal; font-stretch: normal; font-style: normal; line-height: 1.5; letter-spacing: normal; text-align: center; color: #4f5d71;">
                   Please note: Your temporary password will be expired in 72 hours.
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center">
          <table>
            <tr>
              <td align="left" style="width: 448px; height: 48px; font-family: Verdana; font-size: 20px; font-weight: normal; font-stretch: normal; font-style: normal; line-height: 1.5; letter-spacing: normal; text-align: center; color: #4f5d71;">
                Please check the <a href="https://uac.helpjuice.com/marketplace/secrets/9dAvPhMhiU9wIcL5Kdf-FQ" target="_blank">Training<span>&nbsp;</span>Guide</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center">
          <table>
            <tr>
              <td align="left" style="width: 448px; height: 48px; font-family: Verdana; font-size: 20px; font-weight: normal; font-stretch: normal; font-style: normal; line-height: 1.5; letter-spacing: normal; text-align: center; color: #4f5d71;">
                Also, please check the <a href="https://uac.helpjuice.com/marketplace/secrets/9dAvPhMhiU9wIcL5Kdf-FQ" target="_blank">Training<span>&nbsp;</span>Guide</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="width: 580px; height: 48px; mso-padding-alt: 10px;"></td>
      </tr>
      <tr>
        <td align="center">
          <table>
            <tr>
              <td align="center" style="width: 483px;">
                <hr>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="width: 580px; height: 37px; mso-padding-alt: 10px;"></td>
      </tr>
      <tr>
        <td  style="text-align: left; width: 580px; height: 20px; font-family: Verdana; font-size: 16px; font-weight: normal; font-stretch: normal; font-style: normal; line-height: 1.5; letter-spacing: normal; text-align: center; color: #4f5d71;">
            Got any questions? Contact us:
        </td>
        <tr>
          <td style="width: 580px; height: 19px; mso-padding-alt: 10px;"></td>
        </tr>
        <tr>
          <td align="center">
            <table>
              <tr style="width: 480px; font-family: Verdana; font-size: 16px; font-weight: normal; font-stretch: normal; font-style: normal; line-height: 1.5; letter-spacing: normal; text-align: center; color: #4f5d71;">
                <td style="text-align: left; vertical-align: top; width: 480px;">
                  <b>Australia</b><br/>
                  +61 2 9752 0200 (8.30am to 4.30pm, Monday to Friday)
                </td>
              </tr>
            </table>
          </td>
        </tr>
      <tr>
        <td style="width: 580px; height: 70px; mso-padding-alt: 10px;"></td>
      </tr>
    </table>
  </td>
</tr>
`;
