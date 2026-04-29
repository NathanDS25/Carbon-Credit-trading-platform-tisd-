import sys
from PIL import Image

def process_logo(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        data = img.getdata()
        
        new_data = []
        for item in data:
            # If white background (R>240, G>240, B>240), make transparent
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                new_data.append((255, 255, 255, 0))
            # If dark text (R<100, G<100, B<100), make it white
            elif item[0] < 100 and item[1] < 100 and item[2] < 100:
                # Keep the same alpha but change color to white
                new_data.append((240, 240, 240, item[3]))
            else:
                new_data.append(item)
                
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print("Success: Processed logo")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    process_logo(sys.argv[1], sys.argv[2])
