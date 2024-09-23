const MONTHS = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
]

export const months = (config: any) => {
    const cfg = config || {};
    const count = cfg.count || 12;
    const section = cfg.section;
    const values = [];
    let i,value;

    for (i=0;i<count;++i){
        value = MONTHS[Math.ceil(i) % 12];
        values.push(value.substring(0, section));
    }
    return values;
};