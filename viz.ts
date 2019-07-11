import { Genome } from './neat/genome';
import { printGenome } from './viz/genome-viz';
const genome : Genome = {
  nodes: [{
    bias: 0,
    id: 0,
    activation: 'ABSOLUTE',
    type: 'input'
  },
  {
    bias: 0,
    id: 1,
    activation: 'BIPOLAR',
    type: 'output'
  }],
  connections: [{
    from: 0,
    to: 1,
    weight: 1,
    enabled: true,
    innovation: 0
  },
  {
    from: 1,
    to: 0,
    weight: 1,
    enabled: true,
    innovation: 0
  }]
}


printGenome('#viz', {"nodes":[{"id":0,"type":"input","bias":-0.40790898027989897,"activation":"SINUSOID"},{"id":1,"type":"input","bias":0.07672576189725078,"activation":"BIPOLAR_SIGMOID"},{"id":2,"type":"input","bias":0.4996536520702648,"activation":"BENT_IDENTITY"},{"id":3,"type":"input","bias":-0.3607328844263975,"activation":"SOFTSIGN"},{"id":7,"type":"hidden","bias":0.6520461746913497,"activation":"SOFTSIGN"},{"id":17,"type":"hidden","bias":-0.4826258747561951,"activation":"IDENTITY"},{"id":8,"type":"hidden","bias":-0.7185525628956384,"activation":"BENT_IDENTITY"},{"id":18,"type":"hidden","bias":0.0779408577727736,"activation":"BIPOLAR"},{"id":9,"type":"hidden","bias":0.20050748313951772,"activation":"ABSOLUTE"},{"id":10,"type":"hidden","bias":0.014350486035255017,"activation":"SINUSOID"},{"id":11,"type":"hidden","bias":0.8898662481042265,"activation":"GAUSSIAN"},{"id":12,"type":"hidden","bias":0.19502114646456903,"activation":"STEP"},{"id":13,"type":"hidden","bias":0.18585939038166543,"activation":"BIPOLAR_SIGMOID"},{"id":14,"type":"hidden","bias":-0.6695936947617156,"activation":"BIPOLAR_SIGMOID"},{"id":15,"type":"hidden","bias":0.6324339275197417,"activation":"HARD_TANH"},{"id":16,"type":"hidden","bias":-0.2464218126697233,"activation":"STEP"},{"id":4,"type":"output","bias":-0.1953418672674161,"activation":"ABSOLUTE"},{"id":5,"type":"output","bias":-0.3090920169670426,"activation":"BIPOLAR_SIGMOID"},{"id":6,"type":"output","bias":-0.6607758124700922,"activation":"INVERSE"}],"connections":[{"enabled":true,"from":0,"to":4,"innovation":0,"weight":-0.5118518748713541},{"enabled":true,"from":0,"to":5,"innovation":1,"weight":-0.937361074713408},{"enabled":true,"from":0,"to":6,"innovation":2,"weight":-0.3727065489947563},{"enabled":true,"from":1,"to":4,"innovation":3,"weight":-0.8239910678857996},{"enabled":true,"from":1,"to":5,"innovation":4,"weight":0.8953980149235576},{"enabled":true,"from":1,"to":6,"innovation":5,"weight":0.1975500299304258},{"enabled":true,"from":2,"to":4,"innovation":6,"weight":-0.5238517072211835},{"enabled":true,"from":2,"to":5,"innovation":7,"weight":0.20968410955538275},{"enabled":true,"from":2,"to":6,"innovation":8,"weight":-0.37898601687993505},{"enabled":true,"from":3,"to":4,"innovation":9,"weight":0.8146261842521199},{"enabled":true,"from":3,"to":5,"innovation":10,"weight":0.8708475114581233},{"enabled":true,"from":3,"to":6,"innovation":11,"weight":0.38250244113078224},{"enabled":true,"from":1,"to":7,"innovation":32,"weight":0.6409279480976693},{"enabled":true,"from":7,"to":6,"innovation":33,"weight":0.000319067134114448},{"enabled":true,"from":0,"to":8,"innovation":27,"weight":0.12027089992989204},{"enabled":true,"from":8,"to":6,"innovation":28,"weight":0.006188147366628982},{"enabled":true,"from":0,"to":9,"innovation":34,"weight":-0.3927901524002664},{"enabled":true,"from":9,"to":5,"innovation":30,"weight":0.8568464690215478},{"enabled":true,"from":0,"to":10,"innovation":35,"weight":-0.10173367521929322},{"enabled":true,"from":10,"to":4,"innovation":19,"weight":-0.9913310693191306},{"enabled":true,"from":9,"to":11,"innovation":36,"weight":-0.6943796126943198},{"enabled":true,"from":11,"to":5,"innovation":37,"weight":-0.012216619001264917},{"enabled":true,"from":1,"to":12,"innovation":38,"weight":0.05821841916986159},{"enabled":true,"from":12,"to":5,"innovation":39,"weight":0.7886290590104181},{"enabled":true,"from":3,"to":13,"innovation":40,"weight":0.7407893979616347},{"enabled":true,"from":13,"to":6,"innovation":41,"weight":-0.3447610289840668},{"enabled":true,"from":7,"to":14,"innovation":42,"weight":-0.7651450562334503},{"enabled":true,"from":14,"to":6,"innovation":43,"weight":0.611036403599428},{"enabled":true,"from":10,"to":15,"innovation":76,"weight":-0.20643632647261256},{"enabled":true,"from":15,"to":4,"innovation":77,"weight":0.42628794742995524},{"enabled":true,"from":3,"to":16,"innovation":78,"weight":0.697017127811705},{"enabled":true,"from":16,"to":4,"innovation":79,"weight":-0.3773676457894908},{"enabled":true,"from":0,"to":17,"innovation":80,"weight":-0.4178566485461488},{"enabled":true,"from":17,"to":8,"innovation":81,"weight":-0.9033832825443824},{"enabled":true,"from":0,"to":18,"innovation":74,"weight":-0.6611756593265454},{"enabled":true,"from":18,"to":9,"innovation":82,"weight":-0.9090180638049787},{"enabled":true,"from":0,"to":15,"innovation":57,"weight":-0.849909463457152},{"enabled":true,"from":15,"to":10,"innovation":69,"weight":-0.0386989681464911},{"enabled":true,"from":1,"to":16,"innovation":70,"weight":-0.6735572690868139},{"enabled":true,"from":16,"to":7,"innovation":71,"weight":0.37546117980673444},{"enabled":true,"from":12,"to":17,"innovation":72,"weight":0.7822146914077166},{"enabled":true,"from":17,"to":5,"innovation":73,"weight":0.8594472108270566},{"enabled":true,"from":18,"to":6,"innovation":75,"weight":0.7513680368065252},{"enabled":true,"from":15,"to":6,"innovation":58,"weight":-0.6031673873476393},{"enabled":true,"from":13,"to":16,"innovation":59,"weight":0.9981029808222956},{"enabled":true,"from":16,"to":6,"innovation":60,"weight":-0.6577767319104169},{"enabled":true,"from":14,"to":17,"innovation":61,"weight":0.7704158755113895},{"enabled":true,"from":17,"to":6,"innovation":62,"weight":-0.40896191850697505},{"enabled":true,"from":1,"to":18,"innovation":63,"weight":0.266556141556066},{"enabled":true,"from":18,"to":5,"innovation":64,"weight":-0.20716920811173622}],"inputs":4,"outputs":3}
)