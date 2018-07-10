#include "pxt.h"
#include "PianoEvents.h"
#include "MicroBit.h"
using namespace pxt;

#define CHIP_ADDRESS            0x0D

#define PIANO_ID_KEY_K0         0x100
#define PIANO_ID_KEY_K1         0x200
#define PIANO_ID_KEY_K2         0x400
#define PIANO_ID_KEY_K3         0x800
#define PIANO_ID_KEY_K4         0x1000
#define PIANO_ID_KEY_K5         0x2000
#define PIANO_ID_KEY_K6         0x4000
#define PIANO_ID_KEY_K7         0x8000
#define PIANO_ID_KEY_K8         0x01
#define PIANO_ID_KEY_K9         0x02
#define PIANO_ID_KEY_K10        0x04
#define PIANO_ID_KEY_K11        0x08
#define PIANO_ID_KEY_K12        0x10
#define PIANO_ID_KEY_K13        0x20
#define PIANO_ID_KEY_K14        0x40

/**
* Piano Key Events
*/
enum class PianoKeys {
    //% block="K0"
    K0 = PIANO_KEY_K0_PRESS,
    //% block="K1"
    K1 = PIANO_KEY_K1_PRESS,
    //% block="K2"
    K2 = PIANO_KEY_K2_PRESS,
    //% block="K3"
    K3 = PIANO_KEY_K3_PRESS,
    //% block="K4"
    K4 = PIANO_KEY_K4_PRESS,
    //% block="K5"
    K5 = PIANO_KEY_K5_PRESS,
    //% block="K6"
    K6 = PIANO_KEY_K6_PRESS,
    //% block="K7"
    K7 = PIANO_KEY_K7_PRESS,
    //% block="K8"
    K8 = PIANO_KEY_K8_PRESS,
    //% block="K9"
    K9 = PIANO_KEY_K9_PRESS,
    //% block="K10"
    K10 = PIANO_KEY_K10_PRESS,
    //% block="K11"
    K11 = PIANO_KEY_K11_PRESS,
    //% block="K12"
    K12 = PIANO_KEY_K12_PRESS,
    //% block="K13"
    K13 = PIANO_KEY_K13_PRESS,
    //% block="K14"
    K14 = PIANO_KEY_K14_PRESS,
};

/**
 * Kitronik :KLEF Piano for BBC micro:bit MakeCode Package
 */
//% color=#00A654 weight=100 block="Kitronik Piano"
namespace Kitronik_Piano 
{
    bool initialized = false;

    //%
    void setupChangeButton() 
    {
        if (initialized) return;
        //This function sets Pin 1 (/change pin) as a button on the BBC micro:bit so we can receive events
        #define ALLOC_PIN_BUTTON(id) new MicroBitButton(getPin(id)->name, id, MICROBIT_BUTTON_ALL_EVENTS, PullUp);
            ALLOC_PIN_BUTTON(MICROBIT_ID_IO_P1)
        #undef ALLOC_PIN_BUTTON

        initialized = true;
    }

    //%
    void checkKeyPress(short int keyValue) 
    {
        for (int i=0; i<16; i++) 
        {
            if ((0x1<<i) & keyValue)
            {
                MicroBitEvent evt(PIANO_INTERRUPT_ID, i+7);
            }
        }
    }
}