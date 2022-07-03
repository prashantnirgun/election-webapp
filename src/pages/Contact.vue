<template>
  <q-page padding>
    <div class="section-title">
      <h3 class="text-center">CONTACT US</h3>
      <div class="row">
        <div class="col-md-4 col-sm-12 q-pa-sm">
          <div class="contact-about">
            <p class="text-primary text-h4">Panel</p>
            <p>
              Cras fermentum odio eu feugiat. Justo eget magna fermentum iaculis
              eu non diam phasellus. Scelerisque felis imperdiet proin fermentum
              leo. Amet volutpat consequat mauris nunc congue.
            </p>
            <div class="text-decoration-none">
              <q-btn
                bordered
                round
                class="text-primary q-mr-md"
                icon="fab fa-twitter"
                to="#"
              />

              <q-btn
                bordered
                round
                class="text-primary q-mr-md"
                icon="fab fa-facebook-f"
                to="#"
              />
              <q-btn
                bordered
                round
                class="text-primary q-mr-md"
                icon="fab fa-instagram"
                to="#"
              />

              <q-btn
                bordered
                round
                class="text-primary"
                icon="fab fa-linkedin"
                to="#"
              />
            </div>
          </div>
        </div>

        <div class="col-md-3 col-sm-12 q-mt-lg">
          <div class="info">
            <div class="row">
              <div class="col-1 q-mr-md">
                <q-icon color="primary" size="md" name="location_on" />
              </div>
              <div class="col">
                G-11 Central Facility Bldg,<br />APMC Fruit Market, Ground
                Floor,<br />Next to Mango Treat Hotel<br />Sector 19A, Turbhe
                Navi Mumbai
              </div>
            </div>

            <div class="row q-my-lg">
              <div class="col-1 q-mr-md">
                <q-icon color="primary" size="md" name="email" />
              </div>
              <div class="col q-mt-xs">info@tss.net.in</div>
            </div>

            <div class="row">
              <div class="col-1 q-mr-md">
                <q-icon color="primary" size="md" name="call" />
              </div>
              <div class="col">
                922 3588 456, 9324 360 777,<br />022 49664 6868
              </div>
            </div>

            <div class="row q-mt-lg">
              <div class="col-1 q-mr-md">
                <q-icon color="primary" size="md" name="rocket_launch" />
              </div>
              <div class="col q-mt-xs">https://tss.net.in</div>
            </div>
          </div>
        </div>

        <div class="col-md-4 col-sm-12 q-py-sm">
          <q-form>
            <q-input
              outlined
              dense
              class=""
              placeholder="Your Name"
              required
              :rules="[(val) => !!val || 'Field is required']"
            />
            <q-input
              type="email"
              outlined
              dense
              placeholder="Your Email"
              required
              :rules="[(val) => !!val || 'Field is required']"
            />

            <q-input
              type="text"
              outlined
              dense
              placeholder="Subject"
              required
              :rules="[(val) => !!val || 'Field is required']"
            />

            <q-input
              type="textarea"
              outlined
              dense
              rows="5"
              placeholder="Message"
              required
              :rules="[(val) => !!val || 'Field is required']"
            />
            <q-btn
              color="primary"
              icon="check"
              no-caps
              rounded
              label="Send Message"
            />
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Contact",
};
</script>

<style scoped>
.section-title h3::before {
  margin: 0 15px 10px 0;
}
.section-title h3::before,
.section-title h3::after {
  content: "";
  width: 50px;
  height: 2px;
  background: #3498db;
  display: inline-block;
  margin: 0 15px 20px 15px;
}

*,
::after,
::before {
  box-sizing: border-box;
}
</style>
