const Wreck = require('@hapi/wreck');
const HttpsProxyAgent = require('https-proxy-agent');
const fs = require('fs');

// the URL to make requests against
const apiGET = 'https://www.boredapi.com/api/'; // be sure to have the / at the end if adding a variable route name into final get
const apiPOST = 'http://dummy.restapiexample.com/api/v1/'; // be sure to have the / at the end if adding a variable route name into final post

/**
 *
 * @param {Object} agent the HTTPS proxy agent
 * @param {Object} options contains headers, etc.
 * @param {String} apiURL the URL to make GET requests against
 */
wreckGet = async (agent, options, urlOptions) => {
  // destructure urlOptions
  const { apiURL, route, parameters } = urlOptions;

  console.log(`Running GET request against ${apiURL}${route}?${parameters}`)

  // setup wreck
  const wreckWithProxy = Wreck.defaults({ agent, baseUrl: apiURL, redirects: 10 });

  try {
    const { payload } = await wreckWithProxy.get(`${route}?${parameters}`, options);
    return payload;
  } catch (error) {
    console.log(`wreck error: ${error}`);
  }
}

/**
 *
 * @param {Object} agent the HTTPS proxy agent
 * @param {Object} options contains headers, etc.
 * @param {String} apiURL the URL to make POST requests against
 */
wreckPost = async (agent, options, urlOptions) => {
  // destructure urlOptions
  const { apiURL, route } = urlOptions;

  console.log(`Running POST request against ${apiURL}${route}`)

  const wreckWithProxy = Wreck.defaults({ agent, baseUrl: apiURL, redirects: 10 });

  try {
    // to get a specific route, .get(`${nameOfRoute}?${queryParameters}`)
    const { payload } = await wreckWithProxy.post(`${route}`, options);
    return payload;
  } catch (error) {
    console.log(`wreck error: ${error}`);
  }
}

/**
 * The main driver
 */
main = async () => {

  // setup web proxy if necessary
  const proxy = {
    host: 'some-proxy-here',
    port: 8080,
    rejectUnauthorized: true,
  };

  // This auth would be used in headers for any API calls that require authentication
  // const auth = `${username}:${password}`;

  const options = {
    headers: {
      // uncomment for auth based APIs
      // authorization: `Basic ${Buffer.from(auth).toString('base64')}`,
    },
  };

  const agent = new HttpsProxyAgent(proxy);

  // call GET function
  const getURLOptions = { apiURL: apiGET, route: 'activity', parameters: "type=recreational" };
  const getReponse = await wreckGet(agent, options, getURLOptions);
  console.log(`wreck output\n ${getReponse}`);

  // call POST function
  const postURLOptions = { apiURL: apiPOST, route: 'create' };
  options.payload = {"name":"TestingWreck1","salary":"123","age":"300"};
  const postResponse = await wreckPost(agent, options, postURLOptions);
  console.log(`wreck output\n ${postResponse}`);

}

// Run the main driver
main();
