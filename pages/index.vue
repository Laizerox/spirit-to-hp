<template>
  <v-layout column justify-center>
    <v-flex xs12>
      <h1 class="headline">
        Spirit to HP Calculator
      </h1>
      <p>
        This tools is based on data & formula found in TBC 2.4 client.<br />
        When compared against Classic 1.13 client there can be differences as exact data is not available for vanilla /
        classic client.
      </p>
      <v-form>
        <v-layout row wrap>
          <v-flex xs4>
            <v-select v-model="form.class" :items="classes" item-text="name" item-value="value" label="Class" />
          </v-flex>
          <v-flex xs4>
            <v-text-field v-model="form.level" label="Level" type="number" @input="validateLevel" />
          </v-flex>
          <v-flex xs4>
            <v-text-field v-model="form.spirit" label="Spirit" type="number" />
          </v-flex>
        </v-layout>
      </v-form>
      <p>
        Increases Health Regeneration by {{ Math.floor(GetUnitHealthRegenRateFromSpirit()) }} Per Second while not in
        combat
      </p>
      <p>
        <b>NOTE:</b> In TBC tooltip says above text while howering over spirit which means the value above should be
        multiplied by 2 to get the value per tick
      </p>
    </v-flex>
  </v-layout>
</template>

<script>
import classes from '~/constants/classes';
import gtOCTHealthRegen from '~/constants/gtOCTRegenHP';
import gtRegenHPPerSpt from '~/constants/gtRegenHPPerSpt';
import { GT_MAX_LEVEL } from '~/constants/player';

export default {
  data: () => ({
    form: {
      class: 1,
      level: 1,
      spirit: 10
    },
    classes
  }),
  methods: {
    GetUnitHealthRegenRateFromSpirit: function() {
      const entry = (this.form.class - 1) * GT_MAX_LEVEL + parseInt(this.form.level - 1);
      const baseRatio = gtOCTHealthRegen[entry];
      const extraRatio = gtRegenHPPerSpt[entry];
      if (baseRatio === undefined || extraRatio === undefined) {
        return 0;
      }

      let baseSpirit = parseInt(this.form.spirit);
      if (baseSpirit > 50) {
        baseSpirit = 50;
      }

      const extraSpirit = this.form.spirit - baseSpirit;

      return baseSpirit * baseRatio + extraSpirit * extraRatio;
    },
    validateLevel: function(value) {
      if (!value) {
        this.form.level = 1;
      }

      if (value > GT_MAX_LEVEL) {
        this.form.level = GT_MAX_LEVEL;
      }
    }
  }
};
</script>
