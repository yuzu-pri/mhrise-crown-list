<template>
  <div>
    <div>
      コピペ用テキスト(残りの金冠)
    </div>    
    <textarea cols="20" rows="10">{{ data.tasks }}</textarea>
    残り: {{ data.numberOfRemaining }}
  </div>
  <div>
    <table style="border: solid 1px">
      <thead>
        <td>名前</td>
        <td colspan="2">最小</td>
        <td colspan="2">最大</td>
        <td>備考</td>
      </thead>
      <tr v-for="monster in data.monsters">
        <td>
          {{ monster.name }}
        </td>
       <td>
          <input type="checkbox" v-model="monster.minimumObtained"  v-on:change="save" />
        </td>
       <td>
          {{ monster.minimumSize }}
      </td>
       <td>
          <input type="checkbox" v-model="monster.maximumObtained" v-on:change="save" />
        </td>
        <td>
          {{ monster.maximumSize }}
        </td>
        <td>
          <ul>
            <li v-for="note in monster.notes">
              {{ note }}
            </li>
          </ul>
        </td>
      </tr>
    </table>

  </div>
  <div>
    <input type="button" value="データ初期化" @click="reset" />
  </div>
</template>

<style lang="scss" scoped>
div {
  padding: 2px;
}
table {
  margin: 2px;
}
li {
  list-style-type: none;
}

tr:nth-child(odd){
    background:#eeeeee;
}

input[type=checkbox]{
	width:			20px;
	height:			20px;
	-moz-transform:		scale(1.4);
	-webkit-transform:	scale(1.4);
	transform:		scale(1.4);
}
</style>

<script setup lang="ts">
import {onBeforeMount, onMounted, reactive} from 'vue'
definePageMeta({
  layout: 'default'
})

const storageItemName = 'yuzu-pri-mhrise-crown-list'

interface Monster {
  name: string
  minimumSize: string
  minimumObtained?: boolean
  maximumSize: string
  maximumObtained?: boolean
  notes?: string[]
}

const initial: Monster[] = [
    {name: 'オサイズチ', minimumSize: '946.08', maximumSize: '1343.87'},
    {name: 'ドスバギィ', minimumSize: '895.53', maximumSize: '1272.6'},
    {name: 'クルルヤック', minimumSize: '793.09', maximumSize: '1126.54'},
    {name: 'ドスフロギィ', minimumSize: '823.66', maximumSize: '1169.97'},
    {name: 'アオアシラ', minimumSize: '491.12', maximumSize: '697.62'},
    {name: 'ウルクスス', minimumSize: '315.06 ※1', maximumSize: '656.38', notes: ['※1: イベ★4 最小雪主あわらる！ 確定']},
    {name: 'ラングロトラ', minimumSize: '604.81', maximumSize: '859.11'},
    {name: 'アケノシルム', minimumSize: '746.75', maximumSize: '1168.04', notes: ['※2: 集★4 可愛いのもにも牙はある 乱入']},
    {name: 'ロアルドロス', minimumSize: '1345.74', maximumSize: '1911.57'},
    {name: 'ボルボロス', minimumSize: '1217.10', maximumSize: '1728.83'},
    {name: 'フルフル', minimumSize: '775.52', maximumSize: '1022.28'},
    {name: 'ヨツミワドウ', minimumSize: '849.19', maximumSize: '1206.23'},
    {name: 'ビシュテンゴ', minimumSize: '739.83 ※3', maximumSize: '1137.49 ※4', notes: ['※3: イベ★6 侵襲！ 大天狗と小天狗 確定', '※4: イベ★7 急いては熊を仕損じる 乱入']},
    {name: 'プケプケ', minimumSize: '970.15', maximumSize: '1378.06'},
    {name: 'ジュラトドス', minimumSize: '1327.66', maximumSize: '1885.88'},
    {name: 'バサルモス', minimumSize: '1243.44', maximumSize: '1766.26'},
    {name: 'イソネミクニ', minimumSize: '1359.59', maximumSize: '1931.25'},
    {name: 'リオレイア', minimumSize: '1543.84', maximumSize: '2192.96'},
    {name: 'ベリオロス', minimumSize: '1840.07', maximumSize: '2613.75'},
    {name: 'トビカガチ', minimumSize: '1144.45', maximumSize: '1625.65'},
    {name: 'マガイマガド', minimumSize: '1602.38', maximumSize: '2276.11'},
    {name: 'アンジャナフ', minimumSize: '1448.88', maximumSize: '2058.07'},
    {name: 'ナルガクルガ', minimumSize: '1684.44', maximumSize: '2392.67'},
    {name: 'タマミツネ', minimumSize: '1612.24', maximumSize: '2290.12'},
    {name: 'ゴシャハギ', minimumSize: '643.25', maximumSize: '913.71'},
    {name: 'リオレウス', minimumSize: '1499.71', maximumSize: '2130.27'},
    {name: 'オロミドロ', minimumSize: '2371.15', maximumSize: '3368.12'},
    {name: 'ジンオウガ', minimumSize: '1078.46 ※5', maximumSize: '1925.82', notes: ['※5: イベ★6 青いヒーローの頼れる相棒！ 確定']},
    {name: 'ティガレックス', minimumSize: '1708.86', maximumSize: '2427.36'},
    {name: 'ディアブロス', minimumSize: '1844.69', maximumSize: '2620.31'},
    {name: 'ヤツカダキ', minimumSize: '754.09', maximumSize: '1071.16'},
    {name: 'クシャルダオラ', minimumSize: '1817.47', maximumSize: '2391.41'},
    {name: 'オオナズチ', minimumSize: '2136.6', maximumSize: '2811.32'},
    {name: 'テオ・テスカトル', minimumSize: '1575.33 ※6', maximumSize: '2237.68', notes:['※6: 集★7 高難度:嵐ト炎ヲ司ルモノ']},
    {name: 'ラージャン', minimumSize: '744.40 ※7', maximumSize: '1057.38', notes:['※7: 集7 高難度:鬼はいずこ']},
    {name: 'バゼルギウス', minimumSize: '1696.97', maximumSize: '2410.47'},
    {name: 'バルファルク', minimumSize: '1796.06', maximumSize: '2551.22 ※8', notes: ['※8: 上位探索ツアー']},
    {name: 'ヌシ・アオアシラ', minimumSize: '674.78', maximumSize: '752.91'},
    {name: 'ヌシ・リオレイア', minimumSize: '1916.65', maximumSize: '2340.33'},
    {name: 'ヌシ・タマミツネ', minimumSize: '1934.69 ※9', maximumSize: '2748.15 ※9', notes: ['※9: 集7 高難度:ヌシの名を戴くもの']},
    {name: 'ヌシ・リオレウス', minimumSize: '1649.68 ※9', maximumSize: '2343.30'},
    {name: 'ヌシ・ディアブロス', minimumSize: '2157.39', maximumSize: '2838.67'},
    {name: 'ヌシ・ジンオウガ', minimumSize: '1355.78 ※9', maximumSize: '1925.82'},
  ]

const data = reactive({
  numberOfRemaining: 0 as number,
  tasks: '' as string,
  monsters: [...initial]
})


const getTodo = () => {
  data.numberOfRemaining = 0
  let results: string[] = []
  for (const monster of data.monsters) {
    if (monster.minimumObtained && monster.maximumObtained) {
      continue
    }
    let minimum: string = ''
    let maximum: string = ''

    if (!monster.minimumObtained) {
      minimum = '小'
      data.numberOfRemaining++
    }
    if (!monster.maximumObtained) {
      maximum = '大'
      data.numberOfRemaining++
    }
    const result: string = `${monster.name}${minimum}${maximum}`
    console.log(result)
    results.push(result)
  }
  data.tasks = results.join('\n')
}

onBeforeMount(() => {
  const storageValues = localStorage.getItem(storageItemName)
  if (storageValues !== null) {
    data.monsters = JSON.parse(storageValues)
  }
})

onMounted(()=> {
  getTodo()
})

const save = () => {
  localStorage.setItem(storageItemName, JSON.stringify(data.monsters))
  getTodo()
}

const reset = () => {
  data.monsters = [...initial]
  localStorage.setItem(storageItemName, JSON.stringify([...initial]))
  getTodo()
}
</script>
