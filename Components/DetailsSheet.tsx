import React, { FC, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@utils/sizeNormalization';
import { BorderRadius, BottomSheetViewTypes, Color, FontSize, Variant } from '@typed/enum';
import Button from './Core/Button';
import { IPokemon, IPokemonQuizQuestion } from '@typed/index';
import Img from './Core/Img';
import { setTimerNotification } from '@utils/notifications';
import quizImg from '@assets/Images/quiz.svg';
import successImg from '@assets/Images/success.svg';
import { useDispatch, useSelector } from 'react-redux';
import { AuthState, handleSheetView, IActiveQuizes } from '@redux/Auth/authSlice';
import { AppDispatch } from '@redux/store';

interface IProps {
  meta?: IPokemon & { isQuiz?: boolean };
}

const DetailsSheet: FC<IProps> = ({ meta: pokemon }: IProps) => {
  const [quiz, setQuiz] = useState<IPokemonQuizQuestion[]>(pokemon?.quiz || [])
  const total = quiz.length;
  const isDesc =
    pokemon?.description !== undefined && pokemon?.description?.length > 1;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(pokemon?.isQuiz ? true : false);
  const [startTime, setStartTime] = useState<number | null>(pokemon?.isQuiz ? Date.now() : null);
  const auth = useSelector((state: any) => state.auth as AuthState);
  const dispatch = useDispatch<AppDispatch>();

  const current = quiz[currentIndex];

  useEffect(() => {
    if (auth.activeQuizes && (auth.activeQuizes?.id === pokemon?.id)) {
      setQuiz(auth.activeQuizes?.quiz || [])
    }
  }, [auth.activeQuizes])

  const handleSelect = (option: string) => {
    if (!showAnswer) setSelected(option);
  };

  const handleNext = () => {
    if (!showAnswer) {
      setShowAnswer(true);
      if (selected === current.answer) {
        setScore(prev => prev + 1);
      }
      return;
    }

    if (currentIndex < total - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      setCompleted(true);
      sendEndNotification(timeTaken);
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      return dispatch(handleSheetView(BottomSheetViewTypes.Close));

    }
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelected(null);
      setShowAnswer(false);
    }
  };

  const sendStartNotification = async () => {
    await setTimerNotification({
      durationInSeconds: 300,
      data: {
        stack: 'HomeStack',
        screen: 'Detail',
        params: { id: pokemon?.id as number, isQuiz: true, quiz },
      },
      title: 'Quiz Started!',
      description: `You're starting the quiz on ${pokemon?.name}. Good luck!`,
    });
  };

  const sendEndNotification = async (timeTaken: number) => {
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const readableTime = `${minutes}m ${seconds}s`;

    await setTimerNotification({
      durationInSeconds: 2,
      data: {
        stack: 'HomeStack',
        screen: 'Detail',
        params: { id: pokemon?.id as number, isQuiz: true, quiz },
      },
      title: 'Quiz Completed!',
      description: `You finished the quiz in ${readableTime}. 🎉`,
      finish: true
    });
  };

  const handleStartQuiz = () => {
    setStarted(true);
    setStartTime(Date.now());
    sendStartNotification();
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: pixelSizeVertical(6),
      }}>
        <Img
          source={pokemon?.sprites.other?.dream_world?.front_default}
          resizeMode="cover"
          type="svg"
          containerStyle={{
            display: 'flex',
            marginRight: pixelSizeHorizontal(12),
            width: widthPixel(48),
            height: heightPixel(48),
          }}
          svgProps={{
            width: widthPixel(48),
            height: heightPixel(48),
          }}
        />
        <Text style={styles.title}>{pokemon?.name}</Text>
      </View>

      {isDesc && (
        <Text style={styles.description}>
          {pokemon?.description[2]?.replace(/\n/g, ' ')}
        </Text>
      )}

      {!started ? (
        <View>
          <Img
            source={quizImg}
            type='svg'
            style={{
              width: widthPixel(280),
              height: heightPixel(280),
              marginHorizontal: "auto"
            }}
            svgProps={{
              width: widthPixel(320),
              height: heightPixel(320)
            }}
          />
          <Button
            onPress={handleStartQuiz}
            style={{
              backgroundColor: Color.Primary,
              marginTop: pixelSizeVertical(20),
              height: heightPixel(48),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: Color.TextPrimary, fontWeight: '600', fontSize: FontSize['1.5lg'] }}>
              Start Quiz
            </Text>
          </Button>
        </View>
      ) : !completed && current ? (
        <>
          <Text style={styles.quizInfo}>
            Question {currentIndex + 1} of {total}
          </Text>

          <Text style={styles.question}>{current.question}</Text>

          {current.options.map((option: string, idx: number) => {
            const isSelected = selected === option;
            const isCorrect = current.answer === option;

            let backgroundColor = Color.White;
            if (showAnswer) {
              if (isCorrect) backgroundColor = Color.Green;
              else if (isSelected) backgroundColor = Color.TextPrimary;
            } else if (isSelected) {
              backgroundColor = Color.TextPrimary;
            }

            return (
              <TouchableOpacity
                key={idx}
                onPress={() => handleSelect(option)}
                style={[
                  styles.option,
                  {
                    backgroundColor,
                    borderWidth: 1,
                    borderColor: Color.Dark,
                  },
                ]}>
                <Text
                  style={[
                    styles.optionText,
                    backgroundColor === Color.White && { color: Color.Dark },
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.buttonGroup}>
            <Button
              onPress={handleBack}
              variant={Variant.Transparent}
              style={{
                borderColor: Color.Dark,
                width: '48%',
                height: heightPixel(48),
              }}>
              <Text style={{ color: Color.Dark, fontWeight: '600' }}>
                {currentIndex === 0 ? "Close" : "Go Back"}
              </Text>
            </Button>

            <Button
              onPress={handleNext}
              disabled={!selected}
              style={{
                backgroundColor: Color.Primary,
                opacity: !selected ? 0.6 : 1,
                width: '50%',
                height: heightPixel(48),
              }}>
              <Text style={{ color: Color.TextPrimary, fontWeight: '600' }}>
                {currentIndex === total - 1 && showAnswer ? 'Finish' : 'Next'}
              </Text>
            </Button>
          </View>
        </>
      ) : completed ? (
        <View style={styles.resultContainer}>
          <Img
            source={successImg}
            type='svg'
            style={{
              width: widthPixel(280),
              height: heightPixel(280),
              marginHorizontal: "auto"
            }}
            svgProps={{
              width: widthPixel(280),
              height: heightPixel(280)
            }}
          />
          <Text style={styles.resultText}>Quiz Completed!</Text>
          <Text style={styles.scoreText}>
            You got {score} out of {total} correct.
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default DetailsSheet;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: pixelSizeHorizontal(20),
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: FontSize['4xl'],
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: Color.Dark,
    marginBottom: widthPixel(2),
  },
  description: {
    fontSize: FontSize.lg,
    color: Color.Dark,
    lineHeight: fontPixel(20),
    opacity: 0.5,
    width: '90%',
    marginBottom: widthPixel(8),
  },
  quizInfo: {
    fontSize: FontSize.lg,
    color: Color.Secondary,
    marginBottom: widthPixel(8),
  },
  question: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    marginBottom: widthPixel(14),
    color: Color.Dark,
  },
  option: {
    padding: widthPixel(12),
    marginBottom: widthPixel(10),
    borderRadius: BorderRadius.Small,
    height: heightPixel(48),
    display: 'flex',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: fontPixel(17),
    color: Color.White,
    lineHeight: fontPixel(17),
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: pixelSizeVertical(44),
    width: '100%',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: pixelSizeVertical(30),
  },
  resultText: {
    fontSize: FontSize['3xl'],
    fontWeight: 'bold',
    color: 'green',
    marginBottom: pixelSizeVertical(6),
  },
  scoreText: {
    fontSize: FontSize.lg,
    color: Color.Dark,
    opacity: 0.5
  },
});
