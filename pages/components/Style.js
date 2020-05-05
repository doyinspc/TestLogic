
import React from 'react';
import { Dimensions } from 'react-native';
var {height, width} = Dimensions.get('window');

const HMULTIPLE = 24;
const WMULTIPLE = 24;

let UNIT_HEIGHT = Math.round(height/HMULTIPLE);
let UNIT_WIDTH = Math.round(width/WMULTIPLE);

let MAIN_COLOR = 'teal';
let color1 = '#003B46' //PRIMARY
let color2 = '#07575B' //SECONDARY
let color3 = '#66A5AD'
let color4 = '#cccccc' //'#C4DFE6'
let color5 = '#ffffff' 

//let color1 = '#021C1E',
//let color2 = '#004445',
//let color3 = '#2C7873',
//let color4 = '#6FB98F',
//let color5 = '#ffffff'

module.exports = {
    Sizes:{
        HEIGHTS:height,
        WIDTHS:width,
    },
    Colors:{
        MAIN: MAIN_COLOR ,
        color1: color1, 
        color2: color2, 
        color3: color3,
        color4: color4,
        color5: color5,
        color_icon: '#517fa4'
    },
    Style:{
          container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 70
            },
          activityIndicator: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 80,
            },
          inputbar: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: 80,
                marginTop: 70,
            },
          listItem:{
              fontFamily: 'SulphurPoint',
            },
          topContainer: {
              flex: 1,
              backgroundColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
              height: UNIT_HEIGHT * 8,
            },
          bottomContainer: {
              flex: 2,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
          },
          label: {
            color: '#000',
            fontSize: 12,
            marginHorizontal :50,
            alignSelf: 'flex-start',
            width: UNIT_WIDTH * 20,
            fontFamily: 'SulphurPoint'
          },
          label_min: {
            color: '#000',
            fontSize: 12,
            marginTop: 5,
            alignSelf: 'flex-start',
            width: UNIT_WIDTH * 6,
            fontFamily: 'SulphurPoint'
          },
          h1: {
            fontSize: 25,
            color: color5,
            margin: 1,
            alignSelf: 'center',
            fontFamily: 'SulphurPoint'
          },
          h1_overlay: {
            fontSize: 22,
            padding:3,
            color: color5,
            margin: 1,
            alignSelf:'center',
            fontFamily: 'SulphurPoint'
          },
          h2: {
            fontSize: 15,
            marginTop:20,
            color: color4,
            margin: 1,
            alignSelf: 'center',
            alignContent: 'center',
            fontFamily: 'SulphurPointNormal'
          },
          h2_top: {
            fontSize: 15,
            margin:3,
            color: color1,
            margin: 1,
            fontFamily: 'SulphurPointNormal'
          },
          h2_top_description: {
            fontSize: 15,
            margin:3,
            color: color2,
            margin: 1,
            fontFamily: 'PoiretOne'
          },
          h2_overlay: {
            fontSize: 17,
            marginTop:5,
            color: color5,
            margin: 1,
            alignSelf: 'flex-start',
            alignContent: 'center',
            fontFamily: 'SulphurPointNormal'
          },
          textplace: {
            height: 40, 
            width: UNIT_WIDTH * 20, 
            marginHorizontal :50,
            padding: 2, 
            paddingLeft:5,
            borderColor: color4, 
            borderWidth: 1,
            fontFamily: 'SulphurPointNormal'
          },
          textplace_min: {
            height: 40, 
            width: UNIT_WIDTH * 6, 
            marginTop:2,
            padding: 2, 
            paddingLeft:5,
            borderColor: color4, 
            borderWidth: 1,
            fontFamily: 'SulphurPointNormal'
          },
          buttonplace: {
            height: 40, 
            width: UNIT_WIDTH * 20, 
            marginTop:5,
            backgroundColor: color1,
            color: color5 
          },
          but:{
              height: 40,
              width: UNIT_WIDTH * 20,
              backgroundColor : color1,
              marginHorizontal :50,
              marginTop :20
          },
          but_overlay:{
            height: 40,
            backgroundColor : color3,
            marginHorizontal : UNIT_WIDTH * 3,
            marginTop :20,
            bottom:2
        },
          butSetting:{
            height: 40,
            backgroundColor : color1,
            width: UNIT_WIDTH * 20, 
            marginTop:2,
            padding: 2, 
            paddingLeft:5,
        },
          butlink:{
            height: 40,
            width:UNIT_WIDTH * 20,
            backgroundColor : color4,
            marginLeft :50,
            marginRight:50,
            marginTop :5,
            borderColor : color1,
            borderWidth : 1
          },
          textwidthx:{
            width:UNIT_WIDTH * 20, 
            height: 21,
            margin:2,
            padding:2,
          },
          textwidthx_min:{
            width:UNIT_WIDTH * 6, 
            height: 21,
            margin:0.5,
            padding:2,
          },
          linkText:{
            width:UNIT_WIDTH * 20,
            marginTop:15,
          },
          settingText:{
            alignSelf:'center', 
            fontFamily:'SulphurPoint'
          },
          settingPickerWrapper:{
            flex:1, 
            flexDirection:'row', 
            justifyContent:'center'
          },
          questionCard:{
            flexGrow: 1,
            backgroundColor:color4, 
            marginTop:10, 
            padding:10,
          },
          questionInstruction:{
            flex:1,
            marginTop:3,
            fontFamily: 'SulphurPoint',
            fontSize:40,
            fontWeight: 'bold',
            minHeight:20,
          },
          questionContent:{
            flex:3,
            flexShrink:1,
            flexBasis: 10,
            marginTop:3,
            fontSize: 14,
            fontFamily: 'SulphurPointNormal',
            minHeight:20,
          },
          questionQuestion:{
            flex:1,
            margin:0,
            padding:0,
            fontSize: 14,
            fontFamily: 'SulphurPointNormal',
            minHeight:20,
          },
          table_container: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: color5 },
          table_head: {  height: 45,  backgroundColor: color1 },
          table_wrapper: { flexDirection: 'row' },
          table_title: { flex: 1, backgroundColor: color5 },
          table_row: {  height: 34  },
          table_text: { fontFamily: 'SulphurPoint', textAlign: 'left', paddingLeft:10 },
          table_text_white: { fontFamily: 'SulphurPoint', textAlign: 'left', paddingLeft:10, color:'white', fontWeight:'bold' },
          label_radio: {
            color: '#000',
            fontSize: 14,
            justifyContent:'center',
            alignItems:'center',
            marginTop: 5,
            alignSelf: 'flex-start',
            width: UNIT_WIDTH * 20,
            fontFamily: 'SulphurPoint',
            marginTop: 9
          },
          timers: {
            color: color1,
            fontSize: 20,
            justifyContent:'center',
            alignItems:'center',
            fontFamily: 'PoiretOne',
            marginTop: 9
          },
          section_container: {margin:0, padding:0, borderRadius:1, marginTop:5, flexDirection:'row', justifyContent:'flex-start', alignItems:'stretch', padding:10, backgroundColor: color1 },
          section_text: { color:color5,  fontSize: 15, fontFamily: 'PoiretOne',  paddingLeft:10,  },
          section_icon: { color:color5, fontSize: 22, justifyContent:'center', textAlign: 'left', paddingLeft:10 },
          genButtonGroup:{height:40, backgroundColor:color1},
          genButtonGroup1:{height:60, backgroundColor:color1},
          genButtonStyle:{backgroundColor:color2},
          genButtonTextStyle:{color:color5},
          topSection:{flex:.4, backgroundColor:color1, borderBottomRightRadius: 25, borderBottomLeftRadius:25, alignContent:'center', justifyContent:'center'},
          topSection_small:{flex:.2, backgroundColor:color1, borderBottomRightRadius: 25, borderBottomLeftRadius:25, alignContent:'center', justifyContent:'center'},
          home_list_container: {
            flexDirection:'row',  
            alignSelf:'center', 
            height:100, 
            width:'90%', 
            marginHorizontal:15,
            marginVertical:10, 
            backgroundColor:'white',
            shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 16,
            },

          row_sheet:{flexDirection:'row', margin:2, justifyContent:'center'},
          h2_sheet:{fontFamily:'SulphurPoint', marginRight: 10, color:color2},
          h2_sheets:{flex:1, fontFamily:'PoiretOne', flexWrap: 'wrap',}, 
          home_h1:{fontFamily:'SulphurPoint', fontSize:18, marginBottom: 5},
          home_h2:{flex:1, fontFamily:'SulphurPointNormal', fontSize:12, color:'grey', flexWrap:'wrap', position:'relative' },

        }
};