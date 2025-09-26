import React, { useRef, useEffect } from 'react';
import Picker from 'vanilla-picker';

export default function ColorPicker({ color, onChange, swatches = [], style = {}, ...props }) {
  const pickerRef = useRef();
  const buttonRef = useRef();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Create Picker only once
  useEffect(() => {
    pickerRef.current = new Picker({
      parent: buttonRef.current,
      popup: 'right',
      color,
      editor: true,
      alpha: false,
      layout: 'default',
      templates: {
        popup: `\n  <div class=\"picker_wrapper\">\n    <div class=\"picker_slider picker_hue\"> </div>\n    <div class=\"picker_selector\"> </div>\n    <div class=\"picker_editor\"> </div>\n    <div class=\"picker_sample\"> </div>\n    <div class=\"picker_done\">OK</div>\n    <div class=\"picker_cancel\">Anuluj</div>\n  </div>\n  <div class=\"picker_swatches\"></div>\n`,
      },
      swatches,
      onChange: (c) => {
        if (onChangeRef.current) onChangeRef.current(c.hex);
      },
    });
    return () => {
      if (pickerRef.current) {
        pickerRef.current.destroy();
        pickerRef.current = null;
      }
    };
    // Only run on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update color if prop changes
  useEffect(() => {
    if (pickerRef.current && color !== pickerRef.current.color?.hex) {
      pickerRef.current.setColor(color, true);
    }
  }, [color]);

  // Update swatches if they change
  useEffect(() => {
    if (pickerRef.current) {
      pickerRef.current.setOptions({ swatches });
    }
  }, [swatches]);

  return (
    <button
      ref={buttonRef}
      type="button"
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        border: '1px solid #ccc',
        background: color,
        cursor: 'pointer',
        position: 'relative',
        ...style,
      }}
      {...props}
    />
  );
}
