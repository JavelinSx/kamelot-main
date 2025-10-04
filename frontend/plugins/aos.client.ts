import AOS from "aos";
import "aos/dist/aos.css";

export default defineNuxtPlugin(() => {
  AOS.init({
    duration: 300,
    easing: "ease-in-back",
    once: true,
    offset: 50,
  });
});
