let AUTH = null;
let partner_client_id = null;
const PIXIE_ACCOUNT_ID = 'EK36YGTTGLRTA';
let SELECTED_ORDER_AMOUNT = null;
let merchantIdInPayPal = null;
// let paypal = src('https://www.paypal.com/sdk/js?client-id=AW709mxXOrmjSs5UWW4PQgGkA4gYIJKmOiBdPlM24CwTecfWpOtesxV_mnJo3uppHHwGHu3ZKVNWTONJ&merchant-id=EK36YGTTGLRTA&currency=USD&intent=capture');

async function checkAuth() {
    if (AUTH === null) {
        await GetAccessToken();
    }
}

function setSelectedProductAmount(amount) {
    SELECTED_ORDER_AMOUNT = amount.replace(/[^0-9.]/g, "");
}

checkPageLanding();

async function checkPageLanding() {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('merchantIdInPayPal');
    //we've been redirected here...
    if (id !== null) {
        merchantIdInPayPal = id;
        console.log(merchantIdInPayPal);


    }
    else {
        paypal.Buttons({
            createOrder: async () => {
                let res = await CreateOrder(SELECTED_ORDER_AMOUNT);
                console.log(res.id)
                return res.id;
            },
            onApprove: async function (data, actions) {
                console.log('APPROVED');
                console.log(data)
                const response = await ImmediateCapture(data.orderID);
                console.log(response)

            }
        }).render('#paypal-button-container');
    }
}

async function ConnectWithPayPal() {
    console.log('Connect with PayPal');
    await checkAuth();
    let links = await PostPartnerReferrals();
    console.log(links)
    let signUpLink = links.links[1].href;
    window.location.replace(signUpLink);
}
//CHECKOUT
async function Orders(orderId) {
    await checkAuth();
    var settings = {
        "url": `https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AUTH}`,
            "PayPal-Partner-Attribution-Id": "Pixie_888"
        },
    };

    return await $.ajax(settings).done(function (response) {

        return response;

    });
}

async function PartnerReferrals(referral) {
    await checkAuth();
    var settings = {
        "url": `https://api.sandbox.paypal.com/v2/customer/partner-referrals/${referral}`,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AUTH}`,
        },
    };

    return await $.ajax(settings).done(function (response) {
        return response;
    });
}

async function GetMerchantIntegrations(partnerId, merchantId) {
    await checkAuth();
    var settings = {
        "url": `https://api.sandbox.paypal.com/v1/customer/partners/${PIXIE_ACCOUNT_ID}/merchant-integrations/${merchantIdInPayPal}`,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": [`Bearer ${AUTH}`, "Basic QVc3MDlteFhPcm1qU3M1VVdXNFBRZ0drQTRnWUlKS21PaUJkUGxNMjRDd1RlY2ZXcE90ZXN4Vl9tbkpvM3VwcEhId0dIdTNaS1ZOV1RPTko6RUZ0bTNNa2JtbTZxclpDOFA0eWxVQlR5NWo2aUNWSVN1X2dkaXdjTzN2X0ZpeEtXXzNhQ2dSMDVraGlfMFg2c2hwTjZjV05SRHhmcmlkNFU="]
        },
        "data": {
            "grant_type": "client_credentials"
        }
    };

    return await $.ajax(settings).done(function (response) {
        return response;
    });
}
async function GetAccessToken() {
    var settings = {
        "url": "https://api.sandbox.paypal.com/v1/oauth2/token",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Accept": "application/json",
            "Accept-Language": "en_US",
            "Authorization": "Basic QVc3MDlteFhPcm1qU3M1VVdXNFBRZ0drQTRnWUlKS21PaUJkUGxNMjRDd1RlY2ZXcE90ZXN4Vl9tbkpvM3VwcEhId0dIdTNaS1ZOV1RPTko6RUZ0bTNNa2JtbTZxclpDOFA0eWxVQlR5NWo2aUNWSVN1X2dkaXdjTzN2X0ZpeEtXXzNhQ2dSMDVraGlfMFg2c2hwTjZjV05SRHhmcmlkNFU=",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": {
            "grant_type": "client_credentials"
        }
    };

    await $.ajax(settings).done(function (response) {
        AUTH = response.access_token;
    });
}

async function PostPartnerReferrals() {
    await checkAuth();
    var settings = {
        "url": "https://api.sandbox.paypal.com/v2/customer/partner-referrals",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AUTH}`,
        },
        "data": JSON.stringify({ "tracking_id": " Tracking-ID", "partner_config_override": { "partner_logo_url": "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg", "return_url": "http://localhost:3000/dashboard/", "return_url_description": "the url to return the merchant after the paypal onboarding process.", "action_renewal_url": "https://testenterprises.com/renew-exprired-url", "show_add_credit_card": true }, "operations": [{ "operation": "API_INTEGRATION", "api_integration_preference": { "rest_api_integration": { "integration_method": "PAYPAL", "integration_type": "THIRD_PARTY", "third_party_details": { "features": ["PAYMENT", "REFUND", "PARTNER_FEE"] } } } }], "products": ["EXPRESS_CHECKOUT"], "legal_consents": [{ "type": "SHARE_DATA_CONSENT", "granted": true }] }),
    };

    return await $.ajax(settings).done(function (response) {
        return response;
    });
}


//IMMEDIATE CAPTURE
async function CreateOrder(amount) {
    await checkAuth();
    var settings = {
        "url": "https://api.sandbox.paypal.com/v2/checkout/orders",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AUTH}`,
            "PayPal-Partner-Attribution-Id": "Pixie_888"
        },
        "data": JSON.stringify({ "intent": "CAPTURE", "purchase_units": [{ "amount": { "currency_code": "USD", "value": `${amount}` } }] }),
    };

    return await $.ajax(settings).done(function (response) {
        return response;
    });
}

async function ImmediateCapture(orderId) {
    var settings = {
        "url": `https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "PayPal-Partner-Attribution-Id": "Pixie_888",
            "Authorization": `Bearer ${AUTH}`,
            "Content-Type": "application/json"
        },
    };

    return await $.ajax(settings).done(function (response) {
        return response;
    });
}

// paypal.Buttons({
//     createOrder: async () => {
//         let res = await CreateOrder(SELECTED_ORDER_AMOUNT);
//         return res.id;
//     },
//     onApprove: function (data, actions) {
//         console.log('APPROVED')
//     }
// }).render('#paypal-button-container');