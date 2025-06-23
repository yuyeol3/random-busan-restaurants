import os

# --- 설정 변수 ---
# 검색을 시작할 루트 폴더 경로. '.'은 현재 폴더를 의미합니다.
ROOT_DIR = '.'

# 합치고 싶은 파일의 확장자. 반드시 '.'으로 시작해야 합니다.
FILE_EXTENSIONS = tuple(['.js', 'html', 'css'])

# 결과물을 저장할 파일 이름
OUTPUT_FILENAME = 'combined_code.txt'
# --- 설정 끝 ---


def main():
    """
    지정된 폴더와 하위 폴더를 재귀적으로 탐색하여
    특정 확장자를 가진 파일들을 찾아 하나의 파일로 합칩니다.
    """
    try:
        # 출력 파일을 쓰기 모드(w)와 UTF-8 인코딩으로 엽니다.
        # with 구문을 사용하면 파일이 자동으로 닫힙니다.
        with open(OUTPUT_FILENAME, 'w', encoding='utf-8') as outfile:
            # os.walk를 사용하여 루트 폴더부터 모든 하위 폴더를 탐색합니다.
            # dirpath: 현재 폴더 경로
            # _, dirnames: 현재 폴더에 있는 하위 폴더 목록 (여기서는 사용 안 함)
            # filenames: 현재 폴더에 있는 파일 목록
            for dirpath, _, filenames in os.walk(ROOT_DIR):
                for filename in filenames:
                    # 파일의 확장자가 지정한 확장자와 일치하는지 확인합니다.
                    if filename.endswith(FILE_EXTENSIONS):
                        # 파일의 전체 경로를 생성합니다.
                        full_path = os.path.join(dirpath, filename)
                        
                        # 출력 파일에 표시될 상대 경로를 계산합니다.
                        # os.path.normpath를 사용하여 './' 와 같은 부분을 정리합니다.
                        relative_path = os.path.normpath(os.path.relpath(full_path, ROOT_DIR))

                        print(f"파일 추가 중: {full_path}")
                        
                        # === 경로/파일명 === 형식의 헤더를 출력 파일에 씁니다.
                        outfile.write(f"=== {relative_path} ===\n")
                        
                        try:
                            # 원본 파일을 읽기 모드(r)와 UTF-8 인코딩으로 엽니다.
                            with open(full_path, 'r', encoding='utf-8') as infile:
                                # 파일 내용을 읽어서 출력 파일에 씁니다.
                                outfile.write(infile.read())
                                # 파일 내용 뒤에 줄바꿈을 두 번 추가하여 가독성을 높입니다.
                                outfile.write("\n\n")
                        except Exception as e:
                            # 파일 읽기 중 오류 발생 시 메시지를 출력 파일에 기록합니다.
                            error_message = f"!!! ERROR: 파일을 읽는 중 오류가 발생했습니다: {relative_path} | {e} !!!\n\n"
                            print(error_message)
                            outfile.write(error_message)
                            
    except IOError as e:
        print(f"오류: 출력 파일 '{OUTPUT_FILENAME}'을(를) 열거나 쓸 수 없습니다. | {e}")
    except Exception as e:
        print(f"알 수 없는 오류가 발생했습니다: {e}")

    print(f"\n작업 완료! 결과가 '{OUTPUT_FILENAME}' 파일에 저장되었습니다.")


if __name__ == "__main__":
    main()