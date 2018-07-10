/**
 * Kitronik :KLEF Piano for BBC micro:bit MakeCode Package 
 */
//% weight=100 color=#00A654 icon="\uf001" block="Kitronik Piano"
namespace Kitronik_Piano {

    //Constant Variables
    const CHIP_ADDRESS = 0x0D;

    //Enums
    /**
    * micro:bit Piano Capacitive Touch Key Register Values Post Processing
    */
    export enum PianoKeyAddresses {
        //% block="K0"
        PIANO_ID_KEY_K0 = 0x100,
        //% block="K1"
        PIANO_ID_KEY_K1 = 0x200,
        //% block="K2"
        PIANO_ID_KEY_K2 = 0x400,
        //% block="K3"
        PIANO_ID_KEY_K3 = 0x800,
        //% block="K4"
        PIANO_ID_KEY_K4 = 0x1000,
        //% block="K5"
        PIANO_ID_KEY_K5 = 0x2000,
        //% block="K6"
        PIANO_ID_KEY_K6 = 0x4000,
        //% block="K7"
        PIANO_ID_KEY_K7 = 0x8000,
        //% block="K8"
        PIANO_ID_KEY_K8 = 0x01,
        //% block="K9"
        PIANO_ID_KEY_K9 = 0x02,
        //% block="K10"
        PIANO_ID_KEY_K10 = 0x04,
        //% block="K11"
        PIANO_ID_KEY_K11 = 0x08,
        //% block="K12"
        PIANO_ID_KEY_K12 = 0x10,
        //% block="K13"
        PIANO_ID_KEY_K13 = 0x20,
        //% block="K14"
        PIANO_ID_KEY_K14 = 0x40
    }

    export enum PianoKeyEvents {
        //% block="K0"
        PIANO_KEY_K0_PRESS,
        //% block="K1"
        PIANO_KEY_K1_PRESS,
        //% block="K2"
        PIANO_KEY_K2_PRESS,
        //% block="K3"
        PIANO_KEY_K3_PRESS,
        //% block="K4"
        PIANO_KEY_K4_PRESS,
        //% block="K5"
        PIANO_KEY_K5_PRESS,
        //% block="K6"
        PIANO_KEY_K6_PRESS,
        //% block="K7"
        PIANO_KEY_K7_PRESS,
        //% block="K8"
        PIANO_KEY_K8_PRESS,
        //% block="K9"
        PIANO_KEY_K9_PRESS,
        //% block="K10"
        PIANO_KEY_K10_PRESS,
        //% block="K11"
        PIANO_KEY_K11_PRESS,
        //% block="K12"
        PIANO_KEY_K12_PRESS,
        //% block="K13"
        PIANO_KEY_K13_PRESS,
        //% block="K14"
        PIANO_KEY_K14_PRESS
    }
    

    //Variables
    let buff = pins.createBuffer(1);
    let buff2 = pins.createBuffer(2);
    let buff3 = pins.createBuffer(5);
    let buff4 = pins.createBuffer(1);
    let keyRegValue = 0x0000;
    let oneCount = 0;
    let initialisedFlag = 0;
    let octaveFlag = 0;
    let noteLength = 500;

    /**
     *
     */
    //% shim=Kitronik_Piano::setupChangeButton
    function setupChangeButton(): void {
        return;
    }

    /**
     *
     */
    //% shim=Kitronik_Piano::checkKeyPress
    function checkKeyPress(keyValue: number): number {
        return;
    }

    //Function to raise an event on the new Pin 1 button when one of the Piano keys is pressed
    function keyDispatcher(): void {
        pins.digitalWritePin(DigitalPin.P2, 1)
        basic.pause(250)
        pins.digitalWritePin(DigitalPin.P2, 0)
        let keyValue = readKeyPress();
        checkKeyPress(keyValue);
    }

    //Function to initialise the micro:bit Piano (called on first key press after start-up)
    function initPiano(): void {
        pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
        setupChangeButton()
        control.onEvent(DAL.MICROBIT_ID_IO_P1, DAL.MICROBIT_BUTTON_EVT_DOWN, keyDispatcher);
        //Startup procedure
        //Test /change pin is low, then test basic communication
        if (pins.digitalReadPin(DigitalPin.P1) == 0) {
            //Reads the chip ID, should be 0x11 (chip ID addr = 0)
            buff[0] = 0
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff, false)
            buff = pins.i2cReadBuffer(CHIP_ADDRESS, 1, false)
            while (buff[0] != 0x11) {
                buff = pins.i2cReadBuffer(CHIP_ADDRESS, 1, false)
            }

            //Change sensitivity (burst length) of keys 0-14 to 8
            buff2[0] = 54
            buff2[1] = 8
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 55
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 56
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 57
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 58
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 59
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 60
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 61
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 62
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 63
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 64
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 65
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 66
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 67
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
            buff2[0] = 68
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)

            //Disable key 15 as it is not used
            buff2[0] = 69
            buff2[1] = 0
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)

            //Set Burst Repetition to 5
            buff2[0] = 13
            buff2[1] = 5
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)

            //Send calibration command
            buff2[0] = 10
            buff2[1] = 1
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
        }

        //Read all change status address (General Status addr = 2)
        buff[0] = 2
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff, false)
        buff3 = pins.i2cReadBuffer(CHIP_ADDRESS, 5, false)
        //Continue reading change status address until /change pin goes high
        while (pins.digitalReadPin(DigitalPin.P1) == 0) {
            buff[0] = 2
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff, false)
            buff3 = pins.i2cReadBuffer(CHIP_ADDRESS, 5, false)
        }
        initialisedFlag = 1
    }

    //Function to read the Key Press Registers
    function readKeyPress(): number {
        buff[0] = 2
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff, false)
        buff3 = pins.i2cReadBuffer(CHIP_ADDRESS, 5, false)

        //Address 3 is the addr for keys 0-7 (this will then auto move onto Address 4 for keys 8-15, both reads stored in buff2)
        buff[0] = 3
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff, false)
        buff2 = pins.i2cReadBuffer(CHIP_ADDRESS, 2, false)

        //keyRegValue is a 4 byte number which shows which keys are pressed
        keyRegValue = (buff2[1] + (buff2[0]*256));  

        return keyRegValue; 
    }

    /**
     * Set length of tone produced in ms
     * @param length eg: 500
     */
    //% subcategory=More
    //% blockId="set_note_length" block="set note length to %length|ms" icon="\uf001"
    //% weight=90 blockGap=8
    //% length.min=250 length.max=1000
    export function setNoteLength(length: number): void {
        noteLength = length
    }

    /**
     * Determines if a piano key is pressed and returns boolean
     * @param key press to be checked
     */
    //% subcategory=More
    //% blockId="key_is_pressed" block="key %key|is pressed"
    //% key.fieldEditor="gridpicker" key.fieldOptions.columns=4
    //% weight=95 blockGap=8
    export function keyIsPressed(key: PianoKeys): boolean {
        let keyPressed = false;

        if (initialisedFlag == 0) {
            initPiano()
        }

        if ((key & keyRegValue) == key) {
            keyPressed = true;
        }

        return keyPressed;
    }

    /**
     * Determines if a piano key is pressed and returns boolean
     * @param key press to be checked
     */
    //% subcategory=More
    //% blockId="on_key_press" block="on key %key|press"
    //% key.fieldEditor="gridpicker" key.fieldOptions.columns=4
    //% weight=94 blockGap=8
    export function onKeyPress(key: PianoKeys, handler: Action) {
        control.onEvent(DAL.PIANO_INTERRUPT_ID, key, handler);
    }

    /**
     * Check micro:bit Piano key press and play linked note
     */
    //% blockId="full_piano_play" block="play note on piano key press" icon="\uf001"
    //% weight=91 blockGap=8
    export function fullPianoPlay(): void {
        if (initialisedFlag == 0) {
            initPiano()
        }
        if (pins.digitalReadPin(DigitalPin.P1) == 0) {
        	basic.clearScreen()
            buff[0] = 2
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff, false)
            buff3 = pins.i2cReadBuffer(CHIP_ADDRESS, 5, false)

            //Address 3 is the addr for keys 0-7
            buff[0] = 3
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff, false)
            buff = pins.i2cReadBuffer(CHIP_ADDRESS, 1, false)
            //Address 4 is the addr for keys 8-15
            buff4[0] = 4
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff4, false)
            buff4 = pins.i2cReadBuffer(CHIP_ADDRESS, 1, false)

            if (buff[0] == 0x01) {
                basic.showArrow(ArrowNames.North)
                octaveFlag += 1
            }
            else if (buff[0] == 0x02) {
                //C#
                switch (octaveFlag) {
                    case 0:
                        music.playTone(277, noteLength)
                        break;
                    case 1:
                        music.playTone(554, noteLength)
                        break;
                    case -1:
                        music.playTone(139, noteLength)
                        break;
                }
            }
            else if (buff[0] == 0x04) {
                //D#
                switch (octaveFlag) {
                    case 0:
                        music.playTone(311, noteLength)
                        break;
                    case 1:
                        music.playTone(622, noteLength)
                        break;
                    case -1:
                        music.playTone(156, noteLength)
                        break;
                }
            }
            else if (buff[0] == 0x08) {
                //F#
                switch (octaveFlag) {
                    case 0:
                        music.playTone(370, noteLength)
                        break;
                    case 1:
                        music.playTone(740, noteLength)
                        break;
                    case -1:
                        music.playTone(185, noteLength)
                        break;
                }
            }
            else if (buff[0] == 0x10) {
                //G#
                switch (octaveFlag) {
                    case 0:
                        music.playTone(415, noteLength)
                        break;
                    case 1:
                        music.playTone(831, noteLength)
                        break;
                    case -1:
                        music.playTone(208, noteLength)
                        break;
                }
            }
            else if (buff[0] == 0x20) {
                //A#
                switch (octaveFlag) {
                    case 0:
                        music.playTone(466, noteLength)
                        break;
                    case 1:
                        music.playTone(932, noteLength)
                        break;
                    case -1:
                        music.playTone(233, noteLength)
                        break;
                }
            }
            else if (buff[0] == 0x40) {
                //B
                switch (octaveFlag) {
                    case 0:
                        music.playTone(494, noteLength)
                        break;
                    case 1:
                        music.playTone(988, noteLength)
                        break;
                    case -1:
                        music.playTone(247, noteLength)
                        break;
                }
            }
            else if (buff[0] == 0x80) {
                //C
                switch (octaveFlag) {
                    case 0:
                        music.playTone(523, noteLength)
                        break;
                    case 1:
                        music.playTone(1047, noteLength)
                        break;
                    case -1:
                        music.playTone(262, noteLength)
                        break;
                }
            }
            
            if (buff4[0] == 0x01) {
                basic.showArrow(ArrowNames.South)
                octaveFlag -= 1
            }
            else if (buff4[0] == 0x02) {
                //C
                switch (octaveFlag) {
                    case 0:
                        music.playTone(262, noteLength)
                        break;
                    case 1:
                        music.playTone(523, noteLength)
                        break;
                    case -1:
                        music.playTone(131, noteLength)
                        break;
                }
            }
            else if (buff4[0] == 0x04) {
                //D
                switch (octaveFlag) {
                    case 0:
                        music.playTone(294, noteLength)
                        break;
                    case 1:
                        music.playTone(587, noteLength)
                        break;
                    case -1:
                        music.playTone(147, noteLength)
                        break;
                }
            }
            else if (buff4[0] == 0x08) {
                //E
                switch (octaveFlag) {
                    case 0:
                        music.playTone(330, noteLength)
                        break;
                    case 1:
                        music.playTone(659, noteLength)
                        break;
                    case -1:
                        music.playTone(165, noteLength)
                        break;
                }
            }
            else if (buff4[0] == 0x10) {
                //F
                switch (octaveFlag) {
                    case 0:
                        music.playTone(349, noteLength)
                        break;
                    case 1:
                        music.playTone(698, noteLength)
                        break;
                    case -1:
                        music.playTone(175, noteLength)
                        break;
                }
            }
            else if (buff4[0] == 0x20) {
                //G
                switch (octaveFlag) {
                    case 0:
                        music.playTone(392, noteLength)
                        break;
                    case 1:
                        music.playTone(784, noteLength)
                        break;
                    case -1:
                        music.playTone(196, noteLength)
                        break;
                }
            }
            else if (buff4[0] == 0x40) {
                //A
                switch (octaveFlag) {
                    case 0:
                        music.playTone(440, noteLength)
                        break;
                    case 1:
                        music.playTone(880, noteLength)
                        break;
                    case -1:
                        music.playTone(220, noteLength)
                        break;
                }
            }
            basic.pause(100)
        }
    }
}