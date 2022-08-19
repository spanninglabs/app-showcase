import amplitude from "amplitude-js";

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_KEY;
amplitude.getInstance().init(API_KEY);

export { amplitude };
