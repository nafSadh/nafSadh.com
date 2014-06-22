<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class UnitConvData {

    public static $mapList = array(
        #length
        'ångström' => 'A',
        'parsec' => 'pc',
        'stigma' => 'pm', 'bicron' => 'pm', 'picometer' => 'pm',
        'x unit' => 'xu', 'x-unit' => 'xu', 'siegbahn' => 'xu',
        'weber' => 'Wb', 'maxwell' => 'Mx'
    );
    public static $length = array("m" => 1,
        #SI Units
        "km" => 1.0E3,
        "cm" => 1.0E-2,
        "um" => 1.0E-6,
        "nm" => 1.0E-9,
        "fm" => 1.0E-15,
        "µ" => 1.0E-6,
        "micron" => 1.0E-6,
        #Scientific usage
        "A" => 1.0E-10, //ångström
        "bohr" => 5.291772085918E-11, //5.2917720859(36)E−11 m taken mean ( ± 3.6×10−20 fixed to 1.8
        "AU" => 149597871464, //astronomical unit 	1.495 978 707 00 x 10^11 m 
        "light" => 299792458, //≡ 299792458 m
        "ly" => 9.4607304725808E15, //light year
        "pc" => "206264.8062471*149597871464", //parsec = (360*60*60/PI) * 1AU
        #imperial units
        "lea" => 4828.032, //league ≡ 3miles
        "mi" => 1609.344, //mile ≡ 80 chains ≡ 5280 ft ≡ 1760 yd
        "fur" => 201.168, //furlong ≡ 10 chains = 660 ft = 220 yd
        "ch" => 20.1168, //chain ≡ 22yd ≡ 4 rods
        "yd" => 0.9144, //yard ≡ 3 ft ≡ 36 in
        "rd" => 5.0292, //rod ≡ 16½ ft 	
        "ft" => 0.3048, //foot ≡ 1/3 yd ≡ 12 inches
        "in" => 0.0254, //inch
        "th" => 2.54E-5, //thou ≡ 1/1000in also mil
        "fathom" => 1.8288, //fathom fm ≡ 6 ft [4] = 1.8288 m
        "ft(US)" => "1200/3937", //US servey
        #nautical
        "NL" => 5556, //nautical league NL; nl 	≡ 3 nmi 
        "nl" => 5556, //nautical league NL; nl 	≡ 3 nmi 
        "nmi" => 1852, //exact nautical mile (international)
        "NM" => 1852, //exact
        "NM(Adm)" => 1853.184, //nautical mile (Admiralty)=6080ft
        "NM(US)" => 1853.248, //nautical mile (US pre 1954) ≡ 1853.248 m
        #based on imperial
        "cable" => 185.2, //	≡ 1/10 nmi ≡ 185.2 m
        "cable(imp)" => 185.3184, //≡ 608 ft, cable length imperial
        "cable(us)" => 219.456, //≡ 720 ft 	= 219.456 m
        "finger" => 0.022225, //finger ≡ 7/8 in = 0.022225 m
        "finger(cloth)" => 0.1143, //finger (cloth) ≡ 4½ in = 0.1143 m
        "nail(cloth)" => 0.05715, //nail (cloth)≡ 2¼ in = 0.057 15 m
        "hand" => 0.1016, //hand ≡ 4 in  ≡ 0.1016 m
        "ln" => "0.0254/12", //line 	ln ≡ 1/12 in = 0.002116 m
        "lnk" => 0.201168, //link (Gunter's; Surveyor's) = ≡ 1/100 ch [4] ≡ 0.66 ft ≡ 7.92in
        //link (Ramsden's; Engineer's) = 1ft
        "mickey" => 0.000127, //1/200 in
        "mi(geo)" => 1853.7936, //mile (geographical) (H) ≡ 6082 ft = 1853.7936 m
        "mi(data)" => 1828.8, //mile (tactical or data) ≡ 6000 ft ≡ 1828.8 m
        "mi(telegraph)" => 1855.3176, //≡ 6087 ft 
        "mi(US)" => "6336E3/3937", //mile (U.S. Survey) mi ≡ 5280 US Survey feet ≡ (5280 × 1200⁄3937) m ≈ 1609.347219 m
        "pace" => 0.762, //2.5ft
        "palm" => 0.0762, //3in
        "quarter" => 0.2286, //1/4 yd
        "rope" => 6.096, //20ft
        "span" => 0.2286, //9in
        "stick" => 0.0508, //2in 
        "twp" => "0.0254/1440", //twip ≡ 1/1440 in
        #Tex
        "pica" => "12*", //12point
        "pt" => "0.0254/72", //Post script, Adobe
        "pt(US)" => "0.0254/72.272", //US & ENglish
        "pt(EN)" => "0.0254/72.272", //
        "pt((TeX)" => "0.0254/72.27", //
        "pt(Didot)" => "27.07E-3/72", //	≡ 1/12 × 1/72 of pied du roi;
        "pt(EU)" => "27.07E-3/72", //Didot or Europe
        #Historical
        "barleycorn" => "0.0254/3",
        "cubit" => 0.4572, //≡ Distance from fingers to elbow ≈ 18 in
        "ell" => 1.143, //ell ≡ 45 in [4] (In England usually) = 1.143 m
        #misc
        "charriere" => "1.0E-3/3", //french; charriere F ≡ 1⁄3 mm = 0.3 ×10−3 m
        "mil" => 10000, //mil (Sweden and Norway) ≡ 10 km
        "spat" => 1.0E12, //mil (Sweden and Norway) ≡ 10 km
        "xu" => 100.21E-15, //x unit; siegbahn, wavelength of X ray
        #Z        
        #bangla
        "হাত" => 0.4572,
        "z" => 1
    );
    public static $MagneticFlux = array(
        'Wb' => 1, //weber  = 1 Wb = 1 V·s = 1 kg·m2/(A·s2)
        'Mx' => 1.0E-8        //maxwell
    );

}

?>
