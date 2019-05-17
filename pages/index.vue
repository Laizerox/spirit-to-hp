<template>
  <v-layout column justify-center>
    <v-flex xs12 tag="h1" class="headline">
      Spirit to regeneration
    </v-flex>
    <v-flex xs12>
      <p class="ma-1 pa-1">
        This tool is based on data and formulas found in TBC 2.4 client<br />
        When comparing values against Classic 1.13 client there can be differences as exact data is not available for
        vanilla / classic client
      </p>
    </v-flex>
    <v-divider />
    <v-flex xs12 mt-2 pa-1>
      <v-layout row warp>
        <v-flex xs12 lg6 pa-1 mr-4>
          <v-form>
            <v-layout column wrap>
              <v-flex>
                <v-select v-model="form.class" :items="classes" item-text="name" item-value="value" label="Class" />
              </v-flex>
              <v-flex>
                <v-text-field v-model="form.level" label="Level" type="number" @input="validateLevel" />
              </v-flex>
              <v-flex>
                <v-text-field v-model="form.spirit" label="Spirit" type="number" />
              </v-flex>
              <v-flex>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.intellect"
                      label="Intellect"
                      type="number"
                      :disabled="form.classic"
                      v-on="on"
                    />
                  </template>
                  <span>In TBC 2.4 intellect increases mana regenerated per spirit</span>
                </v-tooltip>
              </v-flex>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-switch v-model="form.troll">
                    <template v-slot:label>
                      Troll racial
                    </template>
                  </v-switch>
                </v-flex>
                <v-flex xs6>
                  <v-switch v-model="form.classic">
                    <template v-slot:label>
                      Classic
                    </template>
                  </v-switch>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-form>
        </v-flex>
        <v-flex xs12 lg6 pa-1 ml-2>
          <v-sheet :elevation="6" class="pa-1">
            <v-toolbar color="light-blue" dark>
              <v-toolbar-title>Regeneration</v-toolbar-title>
            </v-toolbar>
            <v-list one-line subheader>
              <v-subheader>Health</v-subheader>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>HP5</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ GetUnitHealthRegenRateFromSpirit(5) }}</v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Health regeneration per second</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ GetUnitHealthRegenRateFromSpirit() }}</v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Health regeneration per tick</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ GetUnitHealthRegenRateFromSpirit(2) }}</v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider></v-divider>
              <v-subheader>Mana</v-subheader>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>MP5</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ GetUnitManaRegenRateFromSpirit(5) }}</v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Mana regeneration per second</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ GetUnitManaRegenRateFromSpirit() }}</v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Mana regeneration per tick</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ GetUnitManaRegenRateFromSpirit(2) }}</v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-sheet class="mt-auto align-center justify-center pa-2" color="rgba(0, 0, 0, .75)" dark>
              <span class="font-weight-bold red--text text--darken-1">
                Please note that the values above assume that character is out of combat.
              </span>
              <br />
              In TBC tooltip has an ability to show how much health and mana you regenerate. This way formulas and
              values used by client in lua / addons are reversible.
            </v-sheet>
          </v-sheet>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import classes from '~/constants/classes';
import gtOCTHealthRegen from '~/constants/gtOCTRegenHP';
import gtRegenHPPerSpt from '~/constants/gtRegenHPPerSpt';
import gtRegenMPPerSpt from '~/constants/gtRegenMPPerSpt';
import { GT_MAX_LEVEL } from '~/constants/player';

export default {
  data: () => ({
    form: {
      class: 1,
      level: 1,
      spirit: 10,
      intellect: 1,
      classic: false,
      troll: false
    },
    classes
  }),
  methods: {
    GetUnitHealthRegenRateFromSpirit: function(tickRate = 1) {
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
      const baseRegen = baseSpirit * baseRatio + extraSpirit * extraRatio;
      const regen = this.form.troll ? baseRegen * 1.1 : baseRegen;

      return Math.round(regen * tickRate * 100) / 100;
    },
    GetUnitManaRegenRateFromSpirit: function(tickRate = 1) {
      const entry = (this.form.class - 1) * GT_MAX_LEVEL + parseInt(this.form.level - 1);
      const baseRatio = gtRegenMPPerSpt[entry];
      if (baseRatio === undefined) {
        return 0;
      }

      const baseRegen = this.form.spirit * baseRatio;
      const regen = this.form.classic ? baseRegen : Math.sqrt(this.form.intellect) * baseRegen;

      return Math.round(regen * tickRate * 100) / 100;
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
